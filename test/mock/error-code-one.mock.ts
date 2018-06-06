//@ts-ignore
import { use } from "typescript-mix";

/**
 * Error code one defines a situation where properties are not defined in the mixin.
*/



export class MixinOne {
  constructor(public firstName:string, public lastName:string) {}
  getBio() {
    return "I am " + this.firstName + " " + this.lastName;
  }
}
export interface ClientOne extends MixinOne {}
export class ClientOne {
  ///@ts-ignore
  @use( MixinOne ) this;
}



export class MixinTwo {
  constructor(public firstName:string, public lastName:string) {}
  get fullName() {
    return this.firstName + this.lastName;
  }
}
export interface ClientTwo extends MixinTwo {}
export class ClientTwo {
  ///@ts-ignore
  @use( MixinTwo ) this;
}