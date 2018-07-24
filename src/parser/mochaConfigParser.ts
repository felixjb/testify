import * as os from "os";
import { join } from "path";
import { workspace, WorkspaceFolder } from "vscode";

import { ITestFrameworkConfig } from "../interfaces/IWorkspaceConfig";

export function parseConfig(
  ws: WorkspaceFolder
): Promise<ITestFrameworkConfig> {
  return new Promise<ITestFrameworkConfig>(resolve => {
    const configuration = workspace.getConfiguration(
      "javascript-test-runner",
      ws.uri
    );
    let executable: string = configuration.get("mochaExecutable");
    if (!executable) {
      if (os.type() === "Windows_NT") {
        executable = join("node_modules", "bin", "mocha");
      } else {
        executable = join("node_modules", ".bin", "mocha");
      }
    }
    resolve({
      executable,
      framework: "mocha",
      ignorePatterns: configuration.get("mochaIgnorePatterns")
        ? configuration.get<string[]>("mochaIgnorePatterns")
        : [],
      patterns: configuration.get("mochaTestFilePatterns")
        ? configuration.get<string[]>("mochaTestFilePatterns")
        : [new RegExp("test/**/*")]
    });
  });
}
