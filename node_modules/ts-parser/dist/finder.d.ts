import { SourceFile, Node } from 'typescript';
import { Class } from './Class';
export declare function find<T>(source: SourceFile, condition: (node: Node) => (T | undefined), deepFind?: boolean): Promise<T[] | undefined>;
export declare function findClass(source: SourceFile): Promise<Class[] | undefined>;
