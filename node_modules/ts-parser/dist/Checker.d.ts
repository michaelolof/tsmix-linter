import { ThisCall } from './Statement';
import { Range } from "./utilities";
import { MemberType } from './Member';
export declare class SymbolizedHolder {
    readonly holderName: string;
    readonly holderRange: Range;
    readonly filePath: string;
    readonly type: "mixin" | "client";
    readonly members: SymbolizedMember[];
    readonly mixins: string[] | undefined;
    constructor(holderName: string, holderRange: Range, filePath: string, type: "mixin" | "client", members: SymbolizedMember[], mixins?: string[] | undefined);
    getMemberProperties(): SymbolizedMemberArray;
    getMemberMethods(): SymbolizedMemberArray;
    getAllMembersExceptProperties(): SymbolizedMemberArray;
}
export declare class SymbolArray<T> {
    array: T[];
    constructor(...symbol: T[]);
    [Symbol.iterator](): IterableIterator<T>;
    push(...symbol: T[]): void;
    forEach(calback: (value: T, index: number) => void): void;
    [Symbol.toStringTag](): IterableIterator<string>;
    readonly length: number;
    contains(member: T, condition: (thisMeber: T, member: T) => boolean): boolean;
}
export declare class SymbolizedHolderArray extends SymbolArray<SymbolizedHolder> {
    findClients(): SymbolizedHolderArray;
    getSymbolByName(name: string): SymbolizedHolder | undefined;
}
export declare class SymbolizedMember {
    type: MemberType;
    memberName: string;
    memberRange: Range;
    signature: string;
    accessor: "static" | "instance";
    methodThisCalls: ThisCall[] | undefined;
    methodsNoOfArguments: number | undefined;
    constructor(type: MemberType, memberName: string, memberRange: Range, signature: string, accessor: "static" | "instance", methodThisCalls?: ThisCall[] | undefined, methodsNoOfArguments?: number | undefined);
}
export declare class SymbolizedMemberArray extends SymbolArray<SymbolizedMember> {
    doesntHaveMember(member: SymbolizedMember): SymbolizedMember[];
    hasThisCallMember(thisCall: ThisCall): boolean;
}
