export interface IWorkspaceConfig {
  frameworkConfigs: ITestFrameworkConfig[];
}

export interface ITestFrameworkConfig {
  framework: string;
  executable: string;
  patterns: Array<string | RegExp>;
  ignorePatterns: Array<RegExp | string>;
}
