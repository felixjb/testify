import { relative } from "path";
import { WorkspaceFolder } from "vscode";

import { getTestRunner } from "../runners/TestRunnerFactory";

async function runWatch(
  rootPath: WorkspaceFolder,
  fileName: string,
  testName: string
) {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName);
  const testRunner = await getTestRunner(rootPath);

  testRunner.runWatch(rootPath, relativeFilename, testName);
}

export default runWatch;
