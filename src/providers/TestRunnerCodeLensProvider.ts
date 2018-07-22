import {
  CodeLens,
  CodeLensProvider,
  TextDocument,
  window,
  workspace,
  WorkspaceFoldersChangeEvent
} from "vscode";

import TestRunnerDebugCodeLens from "../codelens/TestDebugRunnerCodeLens";
import TestRunnerCodeLens from "../codelens/TestRunnerCodeLens";
import { codeParser } from "../parser/codeParser";
import { parseTestFrameworks } from "../parser/testFrameworkParser";

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
  constructor() {
    // Register workspace folder change listener to detect added/removed workspaces during runtime
    workspace.onDidChangeWorkspaceFolders(this.onWorkspaceChanged);
    // Check existing workspace for mocha/jest dependency
    workspace.workspaceFolders.forEach(ws => {
      parseTestFrameworks(ws)
        .then(r => {
          window.showInformationMessage(
            "Found " +
              r.enabledFrameworks.length +
              " enabled test frameworks in workspace folder " +
              ws.uri.path
          );
        })
        .catch(e =>
          window.showErrorMessage(
            "Error while trying to retrieve test frameworks for workspace folder " +
              ws.uri.path +
              ": " +
              e
          )
        );
    });
    const packageJsonWatcher = workspace.createFileSystemWatcher(
      "**/package.json"
    );
    packageJsonWatcher.onDidChange(this.onPackageJsonChanged);
    packageJsonWatcher.onDidCreate(this.onPackageJsonCreated);
    packageJsonWatcher.onDidDelete(this.onPackageJsonDeleted);
  }

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

  private onWorkspaceChanged(event: WorkspaceFoldersChangeEvent) {
    window.showInformationMessage("Worspace was changed");
  }

  private onPackageJsonChanged(uri) {
    window.showInformationMessage(uri + " was changed");
  }

  private onPackageJsonCreated(uri) {
    window.showInformationMessage(uri + " was created");
  }

  private onPackageJsonDeleted(uri) {
    window.showInformationMessage(uri + " was deleted");
  }
}
