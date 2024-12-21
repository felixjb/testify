import {WorkspaceFolder} from 'vscode'

export type TestParams = {
  workspaceFolder: WorkspaceFolder
  fileName: string
  testName: string
}
