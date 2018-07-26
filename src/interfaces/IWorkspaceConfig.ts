import { ITestRunnerInterface } from "./ITestRunnerInterface";

export interface IWorkspaceConfig {
  frameworkConfigs: ITestFrameworkConfig[];
}

export interface ITestFrameworkConfig {
  framework: string;
  runner: ITestRunnerInterface;
  executable: string;
  patterns: Array<string | RegExp>;
  ignorePatterns: Array<RegExp | string>;
}
