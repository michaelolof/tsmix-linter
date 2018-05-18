import { DecoratorLinter } from './linter';
import { Import, Class, SymbolizedHolderArray, Diagnostic } from 'ts-parser';
import { constants } from './app';
import { SourceFile, Program } from 'typescript';

export const clients:Class[] = [];
export const mixins:SymbolizedHolderArray = new SymbolizedHolderArray();

export async function validateAll(program:Program, interstedFiles:string[]) {
  const allDiagnostics:Diagnostic[] = [];
  if( program === undefined ) {
    return allDiagnostics;
  }
  for(let interestedFile of interstedFiles ) {
    const source = program.getSourceFile( interestedFile );
    if( source === undefined ) continue;
    allDiagnostics.push( ... await validateSource( source, program ) );
  }
  return allDiagnostics;
}

async function validateSource( source:SourceFile, program:Program ) {
  // Verify if the source is using the desired module.
  const sourceDiagnostics:Diagnostic[] = []
  
  // if( source.fileName.endsWith("test-5.ts") === false ) {
  //   console.warn("I am only linting test-5.ts file, remeber to remove this code at validate.ts lint 27")
  //   return sourceDiagnostics;
  // }
  const imports = await getImports( source );
  const imprt = Import.FindImportByModuleName( constants.moduleName, imports );
  if( imprt === undefined ) return sourceDiagnostics;
  sourceDiagnostics.push( ...await new DecoratorLinter( source, program ).validate( imports ) );

  return sourceDiagnostics;
}

async function getImports(source:SourceFile) {
  let imports = Import.ExtractImportFromSource( source );
  if( imports.length === 0 ) {
    imports = await Import.Find( source ) || [];
  }
  return imports;
}


