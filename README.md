# TypeScript Mix Linter

A Linter built on top of TypeScript for linting .ts files using the typescript-mix module library. 

## Dependencies
   * TypeScript
   * TypeScript Mix
 

## Installation
```
$ npm install -g tsmix-linter
```

## How to Use.
```
$ tsmix-linter --help
```
### ------- Linting a File -----------
```
$ tsmix-linter "hello.ts"
```
### ------- Linting all .ts files in a directory ----------
```
$ tsmix-linter "." 
```

## Options
```
--help, -h       Prints the help message.
--version, -v    Prints out the version number.
--watch, -w      Specify if linting is done in watch mode.
--log, -l        Specify how errors are logged. default "normal".
```

## Goals

   * Ensure adherence to typescript-mix standards.

   * Catch errors, code smells and potential bugs when using mixins.

   * Ensure a uniform mixin pattern that is easily recognisahle among different code bases.


## Shutting up the Linter. 
```
///@ts-ignore (Simply place it on top of your code base)
```
