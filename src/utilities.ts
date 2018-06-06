import { GlobSync } from "glob"
import * as path from 'path';
import { createSourceFile, ScriptTarget, DiagnosticCategory } from 'typescript';
import { Import, Range } from 'ts-parser';
import { constants } from './app';
import { Diagnostic } from './linter/index';


export function findAllTSFiles(rootFolder:string):string[] {
  const globPattern = rootFolder + "!(node_modules)/**/*.ts";
  return new GlobSync( globPattern ).found;
}

export function normalizePath(filePath:string) {
  filePath = path.normalize( filePath )
  return filePath.replace(/\\/g, "/")
}

export async function checkIfFileIsUsingLibrary(filePath:string, content:string) {
  const source = createSourceFile( filePath, content, ScriptTarget.ESNext );
  const imports = await Import.Find( source );
  if( imports === undefined ) return false;
  const typescriptMixImport = Import.FindImportByModuleName("typescript-mix", imports );
  if( typescriptMixImport === undefined ) return false;
  return true;
}

/**
 * @param {id} id defines the name of the range in which the error is signified. 
 */
export function createErrorDiagnostic(filePath: string, range: Range, message: string, code?: string, id?:string): Diagnostic {
  return {
    range,
    filePath,
    message,
    code,
    severity: DiagnosticCategory.Error,
    source: constants.appName,
    id,
  }
}
