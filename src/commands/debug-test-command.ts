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
): Promise<void> {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName)
  const testRunner = await getTestRunner(rootPath)

  testRunner.debugTest(rootPath, relativeFilename, testName)
}
