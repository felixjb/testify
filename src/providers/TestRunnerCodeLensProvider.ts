import * as mm from "micromatch";
import * as path from "path";
import {
  CodeLens,
  CodeLensProvider,
  TextDocument,
  Uri,
  workspace
} from "vscode";

import TestRunnerDebugCodeLens from "../codelens/TestDebugRunnerCodeLens";
import TestRunnerCodeLens from "../codelens/TestRunnerCodeLens";
import { PluginConfig } from "../config/PluginConfig";
import { codeParser } from "../parser/codeParser";

function getRootPath({ uri }) {
  const activeWorkspace = workspace.getWorkspaceFolder(uri);

  if (activeWorkspace) {
    return activeWorkspace;
  }

  return workspace;
}

function getCodeLens(rootPath, fileName, testName, startPosition) {
  const testRunnerCodeLens = new TestRunnerCodeLens(
    rootPath,
    fileName,
    testName,
    startPosition
  );

  const debugRunnerCodeLens = new TestRunnerDebugCodeLens(
    rootPath,
    fileName,
    testName,
    startPosition
  );

  return [testRunnerCodeLens, debugRunnerCodeLens];
}

export default class TestRunnerCodeLensProvider implements CodeLensProvider {
  private config: PluginConfig;

  constructor(config: PluginConfig) {
    this.config = config;
  }

  public provideCodeLenses(
    document: TextDocument
  ): CodeLens[] | Thenable<CodeLens[]> {
    const createRangeObject = ({ line }) => document.lineAt(line - 1).range;
    const rootPath = getRootPath(document);

    // Check if the file should be parsed
    if (this.isTestFile(document.uri)) {
      return codeParser(document.getText()).reduce(
        (acc, { loc, testName }) => [
          ...acc,
          ...getCodeLens(
            rootPath,
            document.fileName,
            testName,
            createRangeObject(loc.start)
          )
        ],
        []
      );
    } else {
      return [];
    }
  }

  public resolveCodeLens?(): CodeLens | Thenable<CodeLens> {
    return;
  }

  private isTestFile(uri: Uri) {
    const workspaceFolder = workspace.getWorkspaceFolder(uri);
    const workspaceConfig = this.config.getWorkspaceConfig(workspaceFolder);
    const relativePath = path.relative(workspaceFolder.uri.path, uri.path);
    if (workspaceConfig) {
      for (const c of workspaceConfig.frameworkConfigs) {
        for (const ignorePattern of c.ignorePatterns) {
          if (
            typeof ignorePattern === "string" &&
            mm.isMatch(relativePath, ignorePattern)
          ) {
            return false;
          } else if (
            typeof ignorePattern === "object" &&
            ignorePattern.test(relativePath)
          ) {
            return false;
          }
        }
        for (const pattern of c.patterns) {
          if (
            typeof pattern === "string" &&
            mm.isMatch(relativePath, pattern)
          ) {
            return true;
          } else if (
            typeof pattern === "object" &&
            pattern.test(relativePath)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
