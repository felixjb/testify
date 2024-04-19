import {relative} from 'path'
import {WorkspaceFolder} from 'vscode'
import {getTestRunner} from '../runners/test-runner-factory'

export default async function debugTest(
  rootPath: WorkspaceFolder,
  fileName: string,
  testName: string
): Promise<void> {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName)
  const testRunner = await getTestRunner(rootPath)

  testRunner.debugTest(rootPath, relativeFilename, testName)
}
