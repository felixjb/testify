import * as fs from "fs";
import { join } from "path";
import { WorkspaceFolder } from "vscode";

export enum TestFramework {
  MOCHA,
  JEST
}

export interface ITestFrameworkConfiguration {
  enabledFrameworks: TestFramework[];
}

export function parseTestFrameworks(
  ws: WorkspaceFolder
): Promise<ITestFrameworkConfiguration> {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(join(ws.uri.path, "package.json"), "utf-8", (error, data) => {
        if (error) {
          reject(error);
        } else {
          const result: ITestFrameworkConfiguration = {
            enabledFrameworks: []
          };
          const json = JSON.parse(data);
          if (json && json.devDependencies) {
            result.enabledFrameworks = Object.keys(json.devDependencies)
              .filter(d => TestFramework[d.toUpperCase()])
              .map(d => TestFramework[d.toUpperCase()]);
          }
          resolve(result);
        }
      });
    } catch (ex) {
      reject(ex);
    }
  });
}
