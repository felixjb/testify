import { CodeLens, CodeLensProvider, TextDocument, workspace } from "vscode";

import TestRunnerDebugCodeLens from "../codelens/TestDebugRunnerCodeLens";
import TestRunnerCodeLens from "../codelens/TestRunnerCodeLens";
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
  public provideCodeLenses(
    document: TextDocument
  ): CodeLens[] | Thenable<CodeLens[]> {
    const createRangeObject = ({ line }) => document.lineAt(line - 1).range;
    const rootPath = getRootPath(document);

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
  }

  public resolveCodeLens?(): CodeLens | Thenable<CodeLens> {
    return;
  }
}
