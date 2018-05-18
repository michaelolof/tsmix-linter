export declare function findAllTSFiles(rootFolder: string): string[];
export declare function normalizePath(filePath: string): string;
export declare function checkIfFileIsUsingLibrary(filePath: string, content: string): Promise<boolean>;
