import {CodeLens, Range, workspace, WorkspaceFolder} from 'vscode'

export default class DebugTestCodeLens extends CodeLens {
  constructor(
    rootPath: WorkspaceFolder | typeof workspace,
    fileName: string,
    testName: string,
    range: Range
  ) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: 'testify.debug.test',
      title: 'Debug Test'
    })
  }
}
