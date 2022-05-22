import {CodeLens, Range, WorkspaceFolder} from 'vscode'

export default class TestDebugRunnerCodeLens extends CodeLens {
  constructor(rootPath: WorkspaceFolder, fileName: string, testName: string, range: Range) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: 'testify.debug.test',
      title: 'Debug Test'
    })
  }
}
