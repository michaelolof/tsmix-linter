import { Diagnostic } from '../src/linter/index';
export declare const mockDiagnostics: Promise<Diagnostic[]>;
export declare const fileToIdToDiagnostics: Promise<FileToIdToDiagnosticsMap>;
export interface FileToIdToDiagnosticsMap {
    [filePath: string]: IdToDiagnosticsMap;
}
export interface IdToDiagnosticsMap {
    [id: string]: Diagnostic[];
}
