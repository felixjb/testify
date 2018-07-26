import {
  CodeLens,
  CodeLensProvider,
  Range,
  TextDocument,
  workspace,
  WorkspaceFolder
} from "vscode";

import TestRunnerDebugCodeLens from "../codelens/TestDebugRunnerCodeLens";
import TestRunnerCodeLens from "../codelens/TestRunnerCodeLens";
import { PluginConfig } from "../config/PluginConfig";
import { codeParser } from "../parser/codeParser";

export default class TestRunnerCodeLensProvider implements CodeLensProvider {
  private config: PluginConfig;

  constructor(config: PluginConfig) {
    this.config = config;
  }

  /**
   * Provide code lenses for the given document
   *
   * @param document
   */
  public provideCodeLenses(
    document: TextDocument
  ): CodeLens[] | Thenable<CodeLens[]> {
    // Check if the file should be parsed
    if (this.config.isTestFile(document.uri)) {
      const createRangeObject = ({ line }) => document.lineAt(line - 1).range;
      return codeParser(document.getText()).reduce(
        (acc, { loc, testName }) => [
          ...acc,
          ...this.getCodeLens(
            workspace.getWorkspaceFolder(document.uri),
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

  /**
   * Get all available code lenses
   *
   * @param workspaceFolder Workspace folder of the file
   * @param fileName File name
   * @param testName Test name
   * @param range Range for the code lens
   */
  private getCodeLens(
    workspaceFolder: WorkspaceFolder,
    fileName: string,
    testName: string,
    range: Range
  ) {
    const testRunnerCodeLens = new TestRunnerCodeLens(
      workspaceFolder,
      fileName,
      testName,
      range
    );

    const debugRunnerCodeLens = new TestRunnerDebugCodeLens(
      workspaceFolder,
      fileName,
      testName,
      range
    );

    return [testRunnerCodeLens, debugRunnerCodeLens];
  }
}
