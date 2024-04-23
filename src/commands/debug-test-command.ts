import {relative} from 'path'
import {Command, WorkspaceFolder} from 'vscode'
import {getTestRunner} from '../runners/test-runner-factory'

export function buildDebugTestCommand({
  workspaceFolder,
  fileName,
  testName
}: {
  workspaceFolder: WorkspaceFolder
  fileName: string
  testName: string
}): Command {
  return {
    arguments: [workspaceFolder, fileName, testName],
    command: 'testify.debug.test',
    title: 'Debug Test'
  }
}

export function debugTestCallback(
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
): void {
  const relativeFilename = relative(workspaceFolder.uri.fsPath, fileName)
  const testRunner = getTestRunner(workspaceFolder)

  testRunner.debugTest(workspaceFolder, relativeFilename, testName)
}
