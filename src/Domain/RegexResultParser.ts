import { TestResult } from "./TestResult";
import { TestState } from "./TestState";
import { ResultParser } from "./ResultParser";

export class RegexResultParser implements ResultParser {

  public GetResult(testOutput: [boolean, string]): TestResult {
    if (testOutput[0]) {
      return new TestResult(TestState.Failed, testOutput[1]);
    } else {
      return this.ParseResult(testOutput[1]);
    }
  }

  private ParseResult(resultString: string): TestResult {
    const lines = resultString.split("\n");
    let state: TestState = TestState.Unknown;
    let message = "";
    for (const line of lines) {
      const regexPattern: RegExp = /(\w*)_*TEST\((\w*), (\w*)\)/;
      const match = regexPattern.exec(line);
      if (match !== null) {
        if (match[1] == "IGNORE_") {
          state = TestState.Skipped;
          return new TestResult(state, "");
        } else {
          state = TestState.Passed;
        }
      }
      if (line.includes("Failure in")) {
        state = TestState.Failed;
        message = message.concat(line, "\n");
        continue;
      }
      if (state === TestState.Failed) {
        if (line.trimRight() !== "") {
          message = message.concat(line, "\n");
        } else {
          return new TestResult(state, message.trim());
        }
      }

    }
    return new TestResult(state, message);
  }
}
