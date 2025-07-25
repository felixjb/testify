import {WorkspaceFolder, workspace} from 'vscode'
import {TestRunner} from '../runners/test-runner'
import {escapeQuotesAndSpecialCharacters, toForwardSlashPath} from '../utils/utils'
import {FileAction, TestAction} from './actions'

type BaseCommandContext<ActionType> = {
  testRunner: TestRunner
  action: ActionType
  workspaceFolder: WorkspaceFolder
  fileName: string
}

type TestCommandContext = BaseCommandContext<TestAction> & {testName: string}
type FileCommandContext = BaseCommandContext<FileAction>

type Context = TestCommandContext | FileCommandContext

export function executeCommand(context: Context): void {
  const {workspaceFolder, fileName, testRunner} = context
  const forwardSlashRelativeFileName = toForwardSlashPath(workspace.asRelativePath(fileName, false))
  if ('testName' in context) {
    testRunner[context.action]({
      workspaceFolder,
      fileName: forwardSlashRelativeFileName,
      testName: escapeQuotesAndSpecialCharacters(context.testName)
    })
  } else {
    testRunner[context.action]({workspaceFolder, fileName: forwardSlashRelativeFileName})
  }
}
