import { join, relative } from "path";
import { Uri, WorkspaceFolder } from "vscode";

import { PluginConfig } from "../config/PluginConfig";

export default async function runTest(
  rootPath: WorkspaceFolder,
  fileName: string,
  testName: string,
  config: PluginConfig
) {
  const testRunner = config.getTestRunner(
    Uri.file(join(rootPath.uri.fsPath, fileName))
  );
  if (testRunner) {
    testRunner.runTest(
      rootPath,
      relative(rootPath.uri.fsPath, fileName),
      testName
    );
  } else {
    throw new Error("No test runner in your project. Please install one.");
  }
}
