export * from './UseDecoratorLinter';
import { SymbolizedHolder, SymbolizedHolderArray, Diagnostic as tsParserDiagnostic } from 'ts-parser';
export declare class MixinStore {
    [filePath: string]: SymbolizedHolderArray | undefined;
    static ContainsHolder(mixinStore: MixinStore, holderName: string, holderFilePath: string): SymbolizedHolder | undefined;
    static Push(mixinStore: MixinStore, holder: SymbolizedHolder): void;
}
export interface Diagnostic extends tsParserDiagnostic {
    id?: string;
}
