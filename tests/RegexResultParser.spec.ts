// import { instance, mock } from "ts-mockito";

import { expect } from "chai";
import { readFileSync } from "fs";
import { RegexResultParser } from "../src/Domain/RegexResultParser";
import { TestResult } from "../src/Domain/TestResult";
import { TestState } from "../src/Domain/TestState";

const allTests: { name: string, error: boolean, value: string[], expected: string[] }[] = 
  JSON.parse(readFileSync("tests/testResults.json").toString());

describe("RegexResultParser should", () => {
  allTests.filter(t => t.name.startsWith("failing")).forEach(test => {
    it(`return failed result for '${test.name}''`, () => {
      const resultParser = new RegexResultParser();

      const expectedTestResult = new TestResult(TestState.Failed, test.expected.join("\n"));
      const errorFromRunner = test.error;
      const stringFromRunner = test.value.join("\n");
      expect(resultParser.GetResult([errorFromRunner, stringFromRunner])).to.be.deep.eq(expectedTestResult);
    })
  })

  allTests.filter(t => t.name.startsWith("passing")).forEach(test => {
    it(`return passing result for '${test.name}''`, () => {
      const resultParser = new RegexResultParser();

      const expectedTestResult = new TestResult(TestState.Passed, test.expected.join("\n"));
      const errorFromRunner = test.error;
      const stringFromRunner = test.value.join("\n");
      expect(resultParser.GetResult([errorFromRunner, stringFromRunner])).to.be.deep.eq(expectedTestResult);
    })
  })

  allTests.filter(t => t.name.startsWith("ignored")).forEach(test => {
    it(`return skipped result for '${test.name}''`, () => {
      const resultParser = new RegexResultParser();

      const expectedTestResult = new TestResult(TestState.Skipped, test.expected.join("\n"));
      const errorFromRunner = test.error;
      const stringFromRunner = test.value.join("\n");
      expect(resultParser.GetResult([errorFromRunner, stringFromRunner])).to.be.deep.eq(expectedTestResult);
    })
  })
});