import * as cp from "child_process";
import * as os from "os";
import { join } from "path";
import { window, workspace, WorkspaceFolder } from "vscode";

import { IPackage } from "../interfaces/IPackage";
import { ITestFrameworkConfig } from "../interfaces/IWorkspaceConfig";

export function parseConfig(
  ws: WorkspaceFolder,
  packageJson: IPackage
): Promise<ITestFrameworkConfig> {
  return new Promise<ITestFrameworkConfig>((resolve, reject) => {
    const configuration = workspace.getConfiguration(
      "javascript-test-runner",
      ws.uri
    );
    let executable: string = configuration.get("jestExecutable");
    if (!executable) {
      if (os.type() === "Windows_NT") {
        executable = join("node_modules", "bin", "jest");
      } else {
        executable = join("node_modules", ".bin", "jest");
      }
    }
    // Retrieve the config by executing jest --showConfig
    cp.exec(
      executable + " --showConfig",
      { cwd: ws.uri.path },
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          try {
            const jestJsonConfig = JSON.parse(stdout);
            // Check the there's a custom configuration for the regex/match
            let patterns = [];
            try {
              patterns = configuration.get<string[]>("jestTestFilePatterns");
              if (!patterns || patterns.length === 0) {
                if (jestJsonConfig && jestJsonConfig.configs) {
                  jestJsonConfig.configs.forEach(element => {
                    if (element.testMatch && element.testMatch.length > 0) {
                      if (patterns.length === 0) {
                        patterns = element.testMatch;
                      } else {
                        patterns = patterns.concat(element.testMatch);
                      }
                    } else if (
                      element.testRegex &&
                      element.testRegex.length > 0
                    ) {
                      if (patterns.length === 0) {
                        patterns = [new RegExp(element.testRegex)];
                      } else {
                        patterns.push(new RegExp(element.testRegex));
                      }
                    }
                  });
                } else {
                  patterns = [];
                }
              }
            } catch (ex) {
              window.showErrorMessage(
                "Error while trying to read Jest file patterns from Jest config or settings.json:\n" +
                  ex
              );
            }
            // Check the there's a custom configuration for the ignore pattern
            let ignorePatterns = [];
            try {
              ignorePatterns = configuration.get<string[]>(
                "jestIgnorePatterns"
              );
              if (!ignorePatterns || ignorePatterns.length === 0) {
                if (jestJsonConfig && jestJsonConfig.configs) {
                  jestJsonConfig.configs.forEach(element => {
                    if (
                      element.testPathIgnorePatterns &&
                      element.testPathIgnorePatterns.length > 0
                    ) {
                      if (ignorePatterns.length === 0) {
                        ignorePatterns = element.testPathIgnorePatterns.map(
                          s => new RegExp(s.substring(1, s.lastIndexOf("/")))
                        );
                      } else {
                        ignorePatterns = ignorePatterns.concat(
                          element.testPathIgnorePatterns.map(
                            s => new RegExp(s.substring(1, s.lastIndexOf("/")))
                          )
                        );
                      }
                    }
                  });
                } else {
                  ignorePatterns = [];
                }
              }
            } catch (ex) {
              window.showErrorMessage(
                "Error while trying to read Jest ignore patterns from Jest config or settings.json:\n" +
                  ex
              );
            }
            resolve({
              executable,
              framework: "jest",
              ignorePatterns,
              patterns
            });
          } catch (error) {
            reject(error);
          }
        }
      }
    );
  });
}
