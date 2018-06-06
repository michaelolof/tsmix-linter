export enum ErrorCode {
  One = "tsmix:01",
  Two = "tsmix:02",
  Three = "tsmix:03",
  Four = "tsmix:04",
  Five = "tsmix:05",
}

export const ErrorCodeMap = {
  [ErrorCode.One]: "Client has undefined variables defined in the mixin",
  [ErrorCode.Two]: "Mixin does not implement an interface",
  [ErrorCode.Three]: "Mixin does not correctly implement an interface. Mixin is not self contained.",
  [ErrorCode.Four]: "Delegated method's type do not match.",
  [ErrorCode.Five]: "Mixin not found in declared file."
};