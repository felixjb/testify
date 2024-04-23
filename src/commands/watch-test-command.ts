import {relative} from 'path'
import {Command, WorkspaceFolder} from 'vscode'
import {getTestRunner} from '../runners/test-runner-factory'

export function buildWatchTestCommand({
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
    command: 'testify.watch.test',
    title: 'Watch Test'
  }
}

export function watchTestCallback(
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
): Promise<void> {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName)
  const testRunner = await getTestRunner(rootPath)

  testRunner.watchTest(rootPath, relativeFilename, testName)
}
