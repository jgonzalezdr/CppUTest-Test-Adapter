import { CppUTestGroup } from './CppUTestGroup';

export default class CppUTestSuite extends CppUTestGroup {

  constructor(label: string) {
    super(label, label);
  }

  public UpdateFromTestListString(testListString: string): void {
    const groupAndGroupStrings: string[] = testListString.split("\n").filter(gs => (gs.length > 0));
    this.children.splice(0, this.children.length);
    groupAndGroupStrings
      .map(gs => this.ParseTestInfo(gs))
      .map(split => this.UpdateGroupAndTest(split[0], split[1], split[2], split[3]));
  }

  private UpdateGroupAndTest(groupName: string, testName: string, file: string, line: string): void {
    let testGroup = this.children.find(c => c.label === groupName) as CppUTestGroup;
    if (!testGroup) {
      testGroup = this.AddTestGroup(groupName);
    }
    testGroup.AddTest(testName, file, parseInt(line));
  }

  private ParseTestInfo(testInfo: string): string[] {
    const firstSeparatorIndex = testInfo.indexOf(".");
    const secondSeparatorIndex = testInfo.indexOf(".", firstSeparatorIndex + 1);
    const lastSeparatorIndex = testInfo.lastIndexOf(".");
    const groupName = testInfo.substring(0, firstSeparatorIndex);
    const testName = testInfo.substring(firstSeparatorIndex + 1, secondSeparatorIndex);
    const file = testInfo.substring(secondSeparatorIndex + 1, lastSeparatorIndex);
    const line = testInfo.substring(lastSeparatorIndex + 1);
    return [groupName, testName, file, line];
  }
}
