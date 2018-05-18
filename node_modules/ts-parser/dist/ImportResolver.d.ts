export declare class ImportResolver {
    private originalPath;
    private originalPathArr;
    private currentPath;
    private currentPathArr;
    constructor(currentPath: string);
    resolve(importPath: string, extension?: string): string;
    private moveUpDirectory();
    private mergeCurrentDirectoryWithModule(remaining, extension);
    private static readonly IMPORT_PART_SEPERATOR;
}
