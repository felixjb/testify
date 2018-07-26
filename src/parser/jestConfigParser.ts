import * as fs from "fs";
import { join } from "path";
import {
  window,
  workspace,
  WorkspaceConfiguration,
  WorkspaceFolder
} from "vscode";

import { IPackage } from "../interfaces/IPackage";
import { ITestFrameworkConfig } from "../interfaces/IWorkspaceConfig";
import { TerminalProvider } from "../providers/TerminalProvider";
import { JestTestRunner } from "../runners/JestTestRunner";

export function parseConfig(
  ws: WorkspaceFolder,
  p: IPackage
): Promise<ITestFrameworkConfig> {
  return new Promise<ITestFrameworkConfig>((resolve, reject) => {
    const configuration = workspace.getConfiguration(
      "javascript-test-runner",
      ws.uri
    );
    const executable = getExecutable(configuration);
    if (p.jest) {
      resolve({
        executable,
        framework: "jest",
        ignorePatterns: parseIgnorePatternsFromJson(configuration, p.jest),
        patterns: parsePatternsFromJson(configuration, p.jest as any),
        runner: new JestTestRunner(
          new TerminalProvider(),
          executable,
          configuration.get<string[]>("additionalArgs"),
          configuration.get<{ [key: string]: string }>("envVars")
        )
      });
    } else {
      if (fs.existsSync("jest.config.js")) {
        window.showWarningMessage(
          "Retreiving config from jest.config.js is crrently not supported. Falling back to defaults."
        );
        resolve({
          executable,
          framework: "jest",
          ignorePatterns: parseIgnorePatternsFromJavascript(configuration),
          patterns: parsePatternsFromJavascript(configuration),
          runner: new JestTestRunner(
            new TerminalProvider(),
            executable,
            configuration.get<string[]>("additionalArgs"),
            configuration.get<{ [key: string]: string }>("envVars")
          )
        });
      } else {
        reject("No Jest configuration in workspace");
      }
    }
  });
}

function getExecutable(configuration: WorkspaceConfiguration) {
  const executable: string = configuration.get("jestExecutable");
  if (!executable) {
    return join("node_modules", ".bin", "jest");
  }
  return executable;
}

function parsePatternsFromJavascript(configuration: WorkspaceConfiguration) {
  let patterns = configuration.get<string[]>("jestTestFilePatterns");
  if (!patterns || patterns.length === 0) {
    // Use defaults
    patterns = ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"];
  }

  return patterns;
}

function parseIgnorePatternsFromJavascript(
  configuration: WorkspaceConfiguration
) {
  let patterns = configuration.get<string[]>("jestIgnorePatterns");
  if (!patterns || patterns.length === 0) {
    // Use defaults
    patterns = [new RegExp("node_modules") as any];
  }
  return patterns;
}

function parsePatternsFromJson(
  configuration: WorkspaceConfiguration,
  json: { testMatch?: string[]; testRegex: string }
) {
  let patterns = [];
  try {
    patterns = configuration.get<string[]>("jestTestFilePatterns");
    if (!patterns || patterns.length === 0) {
      if (json) {
        if (json.testMatch && json.testMatch.length > 0) {
          patterns = json.testMatch;
        } else if (json.testRegex && json.testRegex.length > 0) {
          patterns = [new RegExp(json.testRegex)];
        } else {
          // Use defaults
          patterns = [
            "**/__tests__/**/*.js?(x)",
            "**/?(*.)+(spec|test).js?(x)"
          ];
        }
      } else {
        // Use defaults
        patterns = ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"];
      }
    }
  } catch (ex) {
    window.showErrorMessage(
      "Error while trying to read Jest file patterns from Jest config or settings.json:\n" +
        ex
    );
  }
  return patterns;
}

function parseIgnorePatternsFromJson(
  configuration: WorkspaceConfiguration,
  json: { testPathIgnorePatterns?: string[] }
) {
  let ignorePatterns = [];
  try {
    ignorePatterns = configuration.get<string[]>("jestIgnorePatterns");
    if (!ignorePatterns || ignorePatterns.length === 0) {
      if (json) {
        if (
          json.testPathIgnorePatterns &&
          json.testPathIgnorePatterns.length > 0
        ) {
          ignorePatterns = json.testPathIgnorePatterns.map(
            s => new RegExp(s.substring(1, s.lastIndexOf("/")))
          );
        } else {
          // Use defaults
          ignorePatterns = [new RegExp("node_modules")];
        }
      } else {
        // Use defaults
        ignorePatterns = [new RegExp("node_modules")];
      }
    }
  } catch (ex) {
    window.showErrorMessage(
      "Error while trying to read Jest ignore patterns from Jest config or settings.json:\n" +
        ex
    );
  }
  return ignorePatterns;
}
