import {WorkspaceFolder} from 'vscode'

export interface TestRunner {
  readonly path: string

  runTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void
  debugTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void
  watchTest(workspaceFolder: WorkspaceFolder, fileName: string, testName: string): void
}
