import { relative } from "path";
import { WorkspaceFolder } from "vscode";

import { getTestRunner } from "../runners/TestRunnerFactory";

async function debugTest(
  rootPath: WorkspaceFolder,
  fileName: string,
  testName: string
) {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName);
  const testRunner = await getTestRunner(rootPath);

  testRunner.debugTest(rootPath, relativeFilename, testName);
}

export default debugTest;
