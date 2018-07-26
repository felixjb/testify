import * as fs from "fs";
import { join } from "path";
import { window, WorkspaceFolder } from "vscode";

import { IPackage } from "../interfaces/IPackage";
import {
  ITestFrameworkConfig,
  IWorkspaceConfig
} from "../interfaces/IWorkspaceConfig";
import { parseConfig as parseJestConfig } from "./jestConfigParser";
import { parseConfig as parseMochaConfig } from "./mochaConfigParser";

// tslint:disable:no-console
export function parseConfig(ws: WorkspaceFolder): Promise<IWorkspaceConfig> {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(join(ws.uri.path, "package.json"), "utf-8", (error, data) => {
        if (error) {
          reject(error);
        } else {
          const packageJson: IPackage = JSON.parse(data);
          parseDevDependencies(ws, packageJson)
            .then(frameworkConfigs => {
              resolve({ frameworkConfigs });
            })
            .catch(e => {
              window.showErrorMessage(
                "Error while trying to retrieve test frameworks for workspace folder " +
                  ws.uri.path +
                  ": " +
                  e
              );
              reject(e);
            });
        }
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

function parseDevDependencies(
  ws: WorkspaceFolder,
  packageJson: IPackage
): Promise<ITestFrameworkConfig[]> {
  if (packageJson && packageJson.devDependencies) {
    const p = [];
    for (const devDependency of Object.keys(packageJson.devDependencies)) {
      switch (devDependency) {
        case "jest":
          p.push(parseJestConfig(ws, packageJson));
          break;
        case "mocha":
          p.push(parseMochaConfig(ws));
          break;
      }
    }
    if (p.length > 0) {
      return Promise.all<ITestFrameworkConfig>(p);
    }
  }
  return new Promise<ITestFrameworkConfig[]>(resolve => {
    resolve([]);
  });
}
