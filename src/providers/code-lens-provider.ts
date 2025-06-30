import picomatch from 'picomatch'
import {CodeLens, CodeLensProvider, Range, TextDocument, workspace} from 'vscode'
import {buildCodeLensCommands} from '../commands/commands'
import {parseSourceCode} from '../parser/parser'
import {TestParams} from '../runners/test-runner'
import {ConfigurationProvider} from './configuration-provider'

export class TestRunnerCodeLensProvider implements CodeLensProvider {
  public provideCodeLenses(document: TextDocument): CodeLens[] {
    const workspaceFolder = workspace.getWorkspaceFolder(document.uri)
    if (!workspaceFolder) {
      return []
    }

    const configurationProvider = new ConfigurationProvider(workspaceFolder)
    const isExcluded = configurationProvider.excludeFiles.find(pattern =>
      picomatch.isMatch(document.fileName, pattern)
    )
    if (isExcluded) {
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
  }: TestParams & {startPosition: Range}): CodeLens[] {
    const {run, watch, debug} = buildCodeLensCommands(workspaceFolder, fileName, testName)
    return [
      new CodeLens(startPosition, run),
      new CodeLens(startPosition, watch),
      new CodeLens(startPosition, debug)
    ]
  }
}
