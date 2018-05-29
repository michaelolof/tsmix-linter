import { SourceFile, TypeChecker, Program, MethodDeclaration, isPropertyDeclaration, Declaration, isMethodDeclaration } from 'typescript';
import { 
  Import, Class, find, Variable, Argument, createErrorDiagnostic, Diagnostic, SymbolizedHolder, 
  SymbolizedMemberArray, SymbolizedMember, ThisCall, Mixin, Range, getInlineRangeFromPosition, Decorator } from "ts-parser"
import { MixinStore } from './index';
import { constants } from '../app';

export class DecoratorLinter {

  static UseDecoratorId: string = "use";
  static DelegateDecoratorId:string = "delegate";
  checker: TypeChecker

  constructor(private source: SourceFile, private program:Program) {
    this.checker = this.program.getTypeChecker();
  }

  async validate(imports: Import[]) {
    const mixinStore = {} as MixinStore;
    const self = this;
    const diagnostics: Diagnostic[] = [];
    const classesAndVariables = await findClassesAndVariables(this.source);
    if (classesAndVariables === undefined) return diagnostics;

    // Find client (which are classes using the decorator)
    for (let classOrVariable of classesAndVariables) {
      if (classOrVariable instanceof Variable) continue;
      diagnostics.push(... await validateClassUsingUseDecorator(classOrVariable) );
      diagnostics.push(... await validateClassUsingDelegateDecorator(classOrVariable) );
    }
    return diagnostics;

    //--------------------------------------------------------------------
    function findClassesAndVariables(source: SourceFile) {
      return find(source, node => {
        if (Class.IsAClass(node))
          return new Class(node, source.fileName);
        else if (Variable.IsAVariable(node))
          return new Variable(node, source.fileName);
        else
          return undefined;
      });
    }

    async function validateClassUsingUseDecorator(cls: Class) {
      // Check if class is a client and get the mixins used.
      const diagnostics: Diagnostic[] = [];
      const client = self.isClassAUseDecoratorClient(cls);
      if (!client) return diagnostics;

      const mixinArguments = client.arguments;
      const symbolizedMembers = cls.getMembersSymbolizedMemberArray( self.checker ); /** Its redundant calling this over and over again. */
      
      for (let mixinArgument of mixinArguments) {
        const clientSignature:ClientSignature = {
          client: cls,
          symbolizedMembers,
          mixinArgument,
        }
  
        const localMixin = self.isMixinLocalDeclared(mixinArgument.name, classesAndVariables!);
        if (localMixin) {
          diagnostics.push(... await validateLocalMixin(clientSignature, localMixin) )
        } else {
          diagnostics.push(... await validateImportedMixin(clientSignature, mixinArgument) )
        }
      }

      return diagnostics;
    }

    async function validateClassUsingDelegateDecorator(cls:Class) {
      const diagnostics:Diagnostic[] = [];
      const membersUsingDecorator = self.isClassADelegateDecoratorClient( cls );
      if( !membersUsingDecorator ) return diagnostics;   

      for(let memberUsingDecorator of membersUsingDecorator) {
        diagnostics.push(...validateMemberUsingDecorator( memberUsingDecorator ) );
      }
      return diagnostics

      //----------------------------------------------------------------------------------
      function validateMemberUsingDecorator(member:{memberName:string, memberSignature:string, decorator:Decorator}) {
        const diagnostics:Diagnostic[] = [];
        
        for(let arg of member.decorator.getArguments() ) {
          diagnostics.push( ...checkIfSignaturesMatch( member.memberName, member.memberSignature, arg ) );
          diagnostics.push( ...checkIfThisCallsAreImplementedInClient( arg ) );
        }
        return diagnostics;
      }

      function checkIfSignaturesMatch(clientMemberName:string, clientMemberSignature:string, delegatedArgument:Argument) {
        const diagnostics:Diagnostic[] = [];
        const delegatedMemberSignature = self.checker.typeToString( self.checker.getTypeAtLocation( delegatedArgument.element ) ) 
        if( clientMemberSignature !== delegatedMemberSignature ) {
          const nameRange = delegatedArgument.getNameRange();
          if( self.clientHasTSIgnoreFlag( self.source, nameRange ) ) return diagnostics;
          const message = `Delegated Method Type mismatch. \nMethod '${clientMemberName}:${clientMemberSignature}' does not match method '${delegatedArgument.name}:${delegatedMemberSignature}'`;
          diagnostics.push(
            createErrorDiagnostic(
              constants.appName,
              delegatedArgument.filePath,
              nameRange,
              message
            )
          )
        }
        return diagnostics;
      }

      function getFunctionBody(declaration:Declaration):string | undefined {
        if( isMethodDeclaration( declaration ) ) {
          if( declaration.body === undefined ) return undefined;
          return declaration.body.getFullText() as string;
        }
        else
        if( isPropertyDeclaration( declaration ) ) {
          if( declaration.initializer && (declaration.initializer as any)["body"] ) {
            return (declaration.initializer as any)["body"].getFullText();
          }
          else return undefined;
        }
        else return undefined;
      }

      function checkIfThisCallsAreImplementedInClient(arg:Argument) {
        const diagnostics:Diagnostic[] = [];
        const argSymbol = self.checker.getSymbolAtLocation( arg.element as any );        
        if( argSymbol === undefined ) return diagnostics;
        if( argSymbol.declarations === undefined ) return diagnostics;
        const declaration = argSymbol.declarations[0] as Declaration
        const bodyString = getFunctionBody( declaration );
        if( bodyString === undefined ) return diagnostics;
        const thisCalls = ThisCall.Find( bodyString );
        const clientMembersName = cls.getMembers().map( m => m.name );
        if( thisCalls.length === 0 ) return diagnostics;
        for(let thisCall of thisCalls) {
          const nameRange = arg.getNameRange();
          if( self.clientHasTSIgnoreFlag( self.source, nameRange ) ) continue;

          if( clientMembersName.indexOf( thisCall.name ) < 0 ) {
            const code = thisCall.type === "method" ? "this."+ thisCall.name + "(...) method" : "this." + thisCall.name + " property";
            const message = `Mixin Dependency Not Found: \n${code} not found. \nDelegated method ${arg.name} calls a ${code} which is not declared in the client ${cls.name} class`;
            diagnostics.push( 
              createErrorDiagnostic( 
                constants.appName,
                arg.filePath,
                nameRange,
                message,
              )
            )
          }
        }
        return diagnostics;
      }

    }

    async function validateLocalMixin(clientSignature:ClientSignature, mixin:Mixin): Promise<Diagnostic[]> {
      const diagnostics: Diagnostic[] = [];

      diagnostics.push( ...isMixinImplementingAnInterface( mixin, clientSignature.mixinArgument ) );
      
      const storedMixin = MixinStore.ContainsHolder(mixinStore, mixin.name, mixin.filePath);
      
      if (storedMixin === undefined) { /** If Mixin is not in the store */
        const localMixinHolder = await mixin.toSymbolizedHolder("mixin", self.checker);
        MixinStore.Push(mixinStore, localMixinHolder);
        diagnostics.push(...await validateMixin(clientSignature, localMixinHolder));
        return diagnostics;
      } else {
        diagnostics.push(...await validateMixin(clientSignature, storedMixin));
        return diagnostics;
      }

    }

    /**
     * Normally this function is meant to retuen Diagnostic[], but it is returning
     * Diagnostic[] | undefined since I don't want to report every possible error.
     * Some errors are best left to typescript to handle.
     */
    async function validateImportedMixin(clientSignature:ClientSignature, mixinArgument: Argument) {
      // If imported mixin has no import declaration.
      const diagnostics: Diagnostic[] = [];
      const importedObject = Import.FindObject(mixinArgument.name, imports);
      if (importedObject === undefined) return diagnostics;

      // Check if imported Mixin is in the store
      const storedMixin = MixinStore.ContainsHolder(mixinStore, importedObject.name!, importedObject.fromLocation)
      if (storedMixin) {
        diagnostics.push(...await validateMixin(clientSignature, storedMixin));
        return diagnostics;
      }
      // If Imported Mixin is not in the store.
      //--------------------------------------------------------------------------------
      const source = self.program.getSourceFile(importedObject.fromLocation);
      // If source file of imported mixin cannot be found.
      if (source === undefined) {
        const message = `Mixin not found in ${importedObject.toLocation}`;
        diagnostics.push(
          createErrorDiagnostic(
            constants.appName, importedObject.toLocation, mixinArgument.getNameRange(), message
          )
        );
        return diagnostics;
      }

      const mixin = await Mixin.FindWhere(source, mixin => mixin.name === importedObject.name!);
      // If mixin canoot be found in the source file
      if (mixin === undefined) return diagnostics;
      
      diagnostics.push( ...isMixinImplementingAnInterface( mixin, clientSignature.mixinArgument ) );

      const importedMixinHolder = await mixin.toSymbolizedHolder("mixin", self.checker);
      MixinStore.Push(mixinStore, importedMixinHolder)
      diagnostics.push(... await validateMixin(clientSignature, importedMixinHolder));
      return diagnostics;
    }

    async function validateMixin(clientSignature:ClientSignature, mixinHolder: SymbolizedHolder) {
      const diagnostics:Diagnostic[] = [];
      const clientMembers = await clientSignature.symbolizedMembers;
      const client = clientSignature.client;

      const mixinMembers = new SymbolizedMemberArray( ...mixinHolder.members );
      for(let mixinMember of mixinMembers.array ) {
        switch( mixinMember.type ) {
          case "property": 
            diagnostics.push( ...checkIfMixinPropertiesAreDeclaredInClient( mixinMember ) )
          case "method": /** Check if all method body this calls are defined in the client. */
            diagnostics.push( ... await checkIfMixinIsSelfContained( mixinMember ) )
        }

      }

      return diagnostics;
      // ----------------------------------------------------------------------------------------
      function checkIfMixinPropertiesAreDeclaredInClient(mixinMember:SymbolizedMember) {
        const diagnostics:Diagnostic[] = [];
        const clientHasMixinMember = clientMembers.contains( mixinMember, (clientMember, mixinMember) => clientMember.memberName === mixinMember.memberName && clientMember.signature === mixinMember.signature );
        if( !clientHasMixinMember ) {
          const nameRange = client.getNameRange();
          if( self.clientHasTSIgnoreFlag( self.source, nameRange ) ) return diagnostics;

          const message = `Mixin dependency not found. \n(property) '${ mixinMember.memberName }:${ mixinMember.signature }' found in mixin ${ mixinHolder.holderName } is missing in the implementing class '${ client.name }'.`;
          diagnostics.push( 
            createErrorDiagnostic( 
              constants.appName, 
              client.filePath, 
              nameRange, 
              message 
            ) 
          );
        }
        return diagnostics;
      }

      function checkIfMixinIsSelfContained(mixinMember:SymbolizedMember) {
        const diagnostics:Diagnostic[] = [];
        const methodThisCalls = mixinMember.methodThisCalls
        if( methodThisCalls === undefined ) return diagnostics;
        
        // If there are this calls in a method's body that are not part of the 
        // mixin members, then the mixin is not self contained.
        for(let methodThisCall of methodThisCalls) {
          if( mixinMembers.hasThisCallMember( methodThisCall ) ) { 
            continue;
          } else {
            const nameRange = clientSignature.mixinArgument.getNameRange();
            if( self.clientHasTSIgnoreFlag( self.source, nameRange ) ) continue;

            const message = `Mixin does not correctly implement the interface. \nMixin method ${mixinHolder.holderName}.${mixinMember.memberName}(...) calls ${ methodThisCall.codeFormat } which is not defined in the mixin at ${mixinHolder.filePath}. \nEnsure mixin is self contained and purely implements its interface.`;
            diagnostics.push( 
              createErrorDiagnostic( 
                constants.appName, 
                client.filePath, 
                nameRange,
                message 
              )
            )
          }
        }
        return diagnostics;
      }

    }

    function isMixinImplementingAnInterface(mixin:Mixin, mixinArgument:Argument):Diagnostic[] {
      const diagnostics:Diagnostic[] = [];
      if( mixin.getImplementedInterface() ) return diagnostics;
      const nameRange = mixinArgument.getNameRange();
      if( self.clientHasTSIgnoreFlag( self.source, nameRange ) ) return diagnostics;
      const message = `Mixin does not implement an interface. \nMixin '${mixinArgument.name}' is not typed or implementing any known interface. \ntypescript-mix mixins must always implement an interface.`;
      diagnostics.push( 
        createErrorDiagnostic( 
          constants.appName, 
          self.source.fileName, 
          nameRange,
          message 
        )
      )
      return diagnostics;
    }

  }

  private isMixinLocalDeclared(mixinName: string, classesOrVariables: (Class | Variable)[]) {
    for (let classOrVariable of classesOrVariables) {
      if (classOrVariable.name === mixinName) return classOrVariable;
    }
    return undefined;
  }

  private isClassAUseDecoratorClient(cls: Class): { arguments: Argument[] } | false {
    const memberUsingDecorator = cls.getMemberUsingDecorator(DecoratorLinter.UseDecoratorId, "this");
    if (memberUsingDecorator === undefined) return false;
    const decorator = memberUsingDecorator.getDecorator(DecoratorLinter.UseDecoratorId);
    if (decorator === undefined) return false;
    return { arguments: decorator.getArguments() }
  }

  private isClassADelegateDecoratorClient(cls:Class) {
    const membersUsingDecorator = cls.hasMembersUsingDecorator( DecoratorLinter.DelegateDecoratorId );
    if( membersUsingDecorator.length === 0 ) return false;
    const memberToDecorator = membersUsingDecorator.map( member => { 
      return {
        memberName: member.name,
        memberSignature: member.getSymbolSignature( this.checker ),
        decorator: member.getDecorator( DecoratorLinter.DelegateDecoratorId )!
      }
    });
    return memberToDecorator;
  }

  private clientHasTSIgnoreFlag(clientSource:SourceFile, clientRange:Range) {
    const lineContent = clientSource.getFullText().split("\n")[ clientRange.start.line - 1 ];
    if( lineContent === undefined ) return false;
    if( lineContent.includes("//") && lineContent.includes("@ts-ignore") ) return true;
    else return false
  }

}

interface ClientSignature {
  client:Class,
  symbolizedMembers: Promise<SymbolizedMemberArray>
  mixinArgument:Argument
}

