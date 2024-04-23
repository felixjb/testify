import {CodeLens, CodeLensProvider, Range, TextDocument, workspace, WorkspaceFolder} from 'vscode'
import {buildDebugTestCommand} from '../commands/debug-test-command'
import {buildRunTestCommand} from '../commands/run-test-command'
import {buildWatchTestCommand} from '../commands/watch-test-command'
import {parseSourceCode} from '../parser/parser'

export class TestRunnerCodeLensProvider implements CodeLensProvider {
  public provideCodeLenses(document: TextDocument): CodeLens[] {
    const workspaceFolder = workspace.getWorkspaceFolder(document.uri)
    if (!workspaceFolder) {
      return []
    }

    return parseSourceCode(document.getText()).reduce<CodeLens[]>(
      (codeLenses, {loc, title: testName}) => [
        ...codeLenses,
        ...this.getCodeLens({
          workspaceFolder,
          testName,
          fileName: document.fileName,
          startPosition: document.lineAt(loc.start.line - 1).range
        })
      ],
      []
    )
  }

  private getCodeLens({
    workspaceFolder,
    fileName,
    testName,
    startPosition
  }: {
    workspaceFolder: WorkspaceFolder
    fileName: string
    testName: string
    startPosition: Range
  }): CodeLens[] {
    return [
      new CodeLens(startPosition, buildRunTestCommand(workspaceFolder, fileName, testName)),
      new CodeLens(startPosition, buildDebugTestCommand(workspaceFolder, fileName, testName)),
      new CodeLens(startPosition, buildWatchTestCommand(workspaceFolder, fileName, testName))
    ]
  }
}
