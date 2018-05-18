import { GlobSync } from "glob"
import * as path from 'path';
import { createSourceFile, ScriptTarget } from "typescript";
import { Import } from "ts-parser";

export function findAllTSFiles(rootFolder:string):string[] {
  const globPattern = rootFolder + "/!(node_modules)/**/*.ts";
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