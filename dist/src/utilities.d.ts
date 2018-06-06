import { Range } from 'ts-parser';
import { Diagnostic } from './linter/index';
export declare function findAllTSFiles(rootFolder: string): string[];
export declare function normalizePath(filePath: string): string;
export declare function checkIfFileIsUsingLibrary(filePath: string, content: string): Promise<boolean>;
/**
 * @param {id} id defines the name of the range in which the error is signified.
 */
export declare function createErrorDiagnostic(filePath: string, range: Range, message: string, code?: string, id?: string): Diagnostic;
