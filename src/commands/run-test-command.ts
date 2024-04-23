import {relative} from 'path'
import {Command, WorkspaceFolder} from 'vscode'
import {getTestRunner} from '../runners/test-runner-factory'

export function buildRunTestCommand({
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
    command: 'testify.run.test',
    title: 'Run Test'
  }
}

export function runTestCallback(
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
): Promise<void> {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName)
  const testRunner = await getTestRunner(rootPath)

  testRunner.runTest(rootPath, relativeFilename, testName)
}
