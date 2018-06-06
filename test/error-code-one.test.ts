import { ErrorCode } from "../src/linter/errors";
import { fileToIdToDiagnostics, IdToDiagnosticsMap } from './index.test';
import { Diagnostic } from '../src/linter/index';
import { expect } from "chai"

describe(ErrorCode.One + " Defines clients where mixin properties are not defined", () => {
  let idToDiagnostics:IdToDiagnosticsMap;
  
  before( async () => {
    idToDiagnostics = (await fileToIdToDiagnostics)["C:/Users/Michael/Desktop/M.O.O/Programs/custom-npm-modules/tsmix-linter/test/mock/error-code-one.mock.ts"]
  })
  
  describe("case: ClientOne" , () => {
    let diagnostics:Diagnostic[];
    before(() => { diagnostics = idToDiagnostics["ClientOne"] });
    
    it("should throw a total of 2 errors.", () => {
      expect( diagnostics.length ).to.deep.equal( 2 );
    });

    it("it should throw 2 code one errors", () => {
      expect( diagnostics[0].code ).to.deep.equal( ErrorCode.One );
      expect( diagnostics[1].code ).to.deep.equal( ErrorCode.One );
    });
  });

  describe("case: ClientTwo", () => {
    let diagnostics:Diagnostic[];

    before(() => { diagnostics = idToDiagnostics["ClientTwo"] });
    
    it("should throw a total of 2 errors", () => {
      expect( diagnostics.length ).to.deep.equal( 2 );
    })
  })

});