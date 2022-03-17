import { TestResult } from "./TestResult";

export interface ResultParser {
  GetResult(testOutput: [boolean, string]): TestResult;
}
