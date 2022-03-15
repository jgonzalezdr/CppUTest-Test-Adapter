import { ExecException } from "child_process";
import { basename, dirname } from "path";
import { ProcessExecuter } from "../Application/ProcessExecuter";

export default class ExecutableRunner {
  private readonly execFile: Function;
  private readonly kill: Function;
  private readonly command: string;
  private readonly workingDirectory: string;
  public readonly Name: string;

  constructor(processExecuter: ProcessExecuter, command: string, workingDirectory: string = dirname(command)) {
    this.execFile = processExecuter.ExecFile;
    this.kill = processExecuter.KillProcess;
    this.command = command;
    this.workingDirectory = workingDirectory;
    this.Name = basename(command);
  }

  public get Command(): string { return this.command; }

  public GetTestList(): Promise<string> {
    return new Promise<string>((resolve, reject) => this.execFile(this.command, ["-ll"], { cwd: this.workingDirectory }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error('stderr', error);
        reject(error);
      }
      resolve(stdout);
    }));
  }

  public RunTest(group: string, test: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.execFile(this.command, ["-sg", group, "-sn", test, "-v"], { cwd: this.workingDirectory }, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error && error.code === null) {
          console.error('stderr', error);
          reject(stderr);
        }
        resolve(stdout);
      })
    });
  }

  public KillProcess() {
    this.kill();
  }
}
