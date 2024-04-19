import {
  CodeLens,
  CodeLensProvider,
  Range,
  TextDocument,
  Uri,
  workspace,
  WorkspaceFolder
} from 'vscode'
import DebugTestCodeLens from '../codelens/debug-test-code-lens'
import RunTestCodeLens from '../codelens/run-test-code-lens'
import WatchTestCodeLens from '../codelens/watch-test-code-lens'
import {parseSourceCode} from '../parser/parser'

function getRootPath(uri: Uri): WorkspaceFolder | typeof workspace {
  const activeWorkspace = workspace.getWorkspaceFolder(uri)
  return activeWorkspace ?? workspace
}

function getCodeLens({
  rootPath,
  fileName,
  testName,
  startPosition
}: {
  rootPath: WorkspaceFolder | typeof workspace
  fileName: string
  testName: string
  startPosition: Range
}): CodeLens[] {
  return [
    new RunTestCodeLens(rootPath, fileName, testName, startPosition),
    new DebugTestCodeLens(rootPath, fileName, testName, startPosition),
    new WatchTestCodeLens(rootPath, fileName, testName, startPosition)
  ]
}

export default class TestRunnerCodeLensProvider implements CodeLensProvider {
  public provideCodeLenses(document: TextDocument): CodeLens[] | Thenable<CodeLens[]> {
    const createRangeObject = (line: number) => document.lineAt(line - 1).range
    const rootPath = getRootPath(document.uri)

    return parseSourceCode(document.getText()).reduce<CodeLens[]>(
      (codelenses, {loc, title: testName}) => [
        ...codelenses,
        ...getCodeLens({
          rootPath,
          testName,
          fileName: document.fileName,
          startPosition: createRangeObject(loc.start.line)
        })
      ],
      []
    )
  }

  public resolveCodeLens?(lens: CodeLens): CodeLens | Thenable<CodeLens> {
    return lens
  }
}
