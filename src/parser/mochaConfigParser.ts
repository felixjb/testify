import { join } from "path";
import { workspace, WorkspaceFolder } from "vscode";

import { ITestFrameworkConfig } from "../interfaces/IWorkspaceConfig";
import { TerminalProvider } from "../providers/TerminalProvider";
import { MochaTestRunner } from "../runners/MochaTestRunner";

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
      executable = join("node_modules", ".bin", "mocha");
    }
    resolve({
      executable,
      framework: "mocha",
      ignorePatterns: configuration.get<string[]>("mochaIgnorePatterns", []),
      patterns: configuration.get<string[]>("mochaTestFilePatterns", [
        "test/**/*"
      ]),
      runner: new MochaTestRunner(
        new TerminalProvider(),
        executable,
        configuration.get<string[]>("additionalArgs"),
        configuration.get<{ [key: string]: string }>("envVars")
      )
    });
  });
}
