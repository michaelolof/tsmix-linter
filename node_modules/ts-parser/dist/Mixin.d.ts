import { ClassDeclaration, VariableDeclaration, Node, SourceFile } from "typescript";
import { Class } from './Class';
import { Variable } from './Variable';
export declare type Mixin = Class | Variable;
export declare type MixinDeclaration = ClassDeclaration | VariableDeclaration;
export declare const Mixin: {
    IsAMixin(node: Node): node is MixinDeclaration;
    Find(source: SourceFile): Promise<Mixin[] | undefined>;
    FindWhere(source: SourceFile, whereCondition: (mixin: Mixin) => boolean): Variable | Class | undefined;
};
