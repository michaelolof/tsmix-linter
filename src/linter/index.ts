export * from './UseDecoratorLinter';
import { SymbolizedHolder, SymbolizedHolderArray,  } from "ts-parser";

export class MixinStore {
  [filePath:string]: SymbolizedHolderArray|undefined

  static ContainsHolder(mixinStore:MixinStore, holderName:string, holderFilePath:string) {
    const holderArray = mixinStore[ holderFilePath ]
    if( holderArray === undefined ) return undefined;
    const holder = holderArray.getSymbolByName( holderName );
    if( holder === undefined ) return undefined;
    return holder
  }

  static Push(mixinStore:MixinStore, holder:SymbolizedHolder) {
    const arr = mixinStore[ holder.filePath ];
    if( arr === undefined ) {
      mixinStore[ holder.filePath ] = new SymbolizedHolderArray( holder );
    } else {
      arr.push( holder );
      mixinStore[ holder.filePath ] = arr;
    }
  }
  
}





