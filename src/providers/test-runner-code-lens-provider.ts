import {
  CodeLens,
  CodeLensProvider,
  Range,
  TextDocument,
  Uri,
  workspace,
  WorkspaceFolder
} from 'vscode'
import TestRunnerDebugCodeLens from '../codelens/test-debug-runner-code-lens'
import TestRunnerCodeLens from '../codelens/test-runner-code-lens'
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
}) {
  const testRunnerCodeLens = new TestRunnerCodeLens(rootPath, fileName, testName, startPosition)

  const debugRunnerCodeLens = new TestRunnerDebugCodeLens(
    rootPath,
    fileName,
    testName,
    startPosition
  )

  return [testRunnerCodeLens, debugRunnerCodeLens]
}

export default class TestRunnerCodeLensProvider implements CodeLensProvider {
  public provideCodeLenses(document: TextDocument): CodeLens[] | Thenable<CodeLens[]> {
    const createRangeObject = (line: number) => document.lineAt(line - 1).range
    const rootPath = getRootPath(document.uri)

    return parseSourceCode(document.getText()).reduce<
      (TestRunnerCodeLens | TestRunnerDebugCodeLens)[]
    >(
      (acc, {loc, title: testName}) => [
        ...acc,
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
