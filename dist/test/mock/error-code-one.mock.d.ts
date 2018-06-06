/**
 * Error code one defines a situation where properties are not defined in the mixin.
*/
export declare class MixinOne {
    firstName: string;
    lastName: string;
    constructor(firstName: string, lastName: string);
    getBio(): string;
}
export interface ClientOne extends MixinOne {
}
export declare class ClientOne {
    this: any;
}
export declare class MixinTwo {
    firstName: string;
    lastName: string;
    constructor(firstName: string, lastName: string);
    readonly fullName: string;
}
export interface ClientTwo extends MixinTwo {
}
export declare class ClientTwo {
    this: any;
}
