import {relative} from 'path'
import {Command, WorkspaceFolder} from 'vscode'
import {getTestRunner} from '../runners/test-runner-factory'

export function buildRunTestCommand(
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
): Command {
  return {
    arguments: [workspaceFolder, fileName, testName],
    command: 'testify.run.test',
    title: 'Run'
  }
}

export function runTestCallback(
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
): void {
  const relativeFilename = relative(workspaceFolder.uri.fsPath, fileName)
  const testRunner = getTestRunner(workspaceFolder)

  testRunner.runTest(workspaceFolder, relativeFilename, testName)
}
