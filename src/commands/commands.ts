import {relative} from 'path'
import {Command, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {getTestRunner} from '../runners/test-runner-factory'
import {escapeQuotesAndSpecialCharacters, toForwardSlashPath} from '../utils/utils'

enum CommandActionEnum {
  Run = 'run',
  Watch = 'watch',
  Debug = 'debug',
  Rerun = 'rerun'
}

type CommandAction = `${CommandActionEnum}`

export const TestifyCommand: Record<CommandAction, string> = {
  [CommandActionEnum.Run]: 'testify.run.test',
  [CommandActionEnum.Watch]: 'testify.watch.test',
  [CommandActionEnum.Debug]: 'testify.debug.test',
  [CommandActionEnum.Rerun]: 'testify.run.last',
  [CommandActionEnum.RunFile]: 'testify.run.file'
} as const

type CodeLensAction = Exclude<CommandAction, 'rerun'>

type TestCommands = Record<CodeLensAction, Command>

type TestCommandArguments = [workspaceFolder: WorkspaceFolder, fileName: string, testName: string]

export const buildTestCommands = (...args: TestCommandArguments): TestCommands => ({
  [CommandActionEnum.Run]: {
    title: 'Run',
    tooltip: 'Run test',
    command: TestifyCommand.run,
    arguments: args
  },
  [CommandActionEnum.Watch]: {
    title: 'Watch',
    tooltip: 'Run test on watch mode',
    command: TestifyCommand.watch,
    arguments: args
  },
  [CommandActionEnum.Debug]: {
    title: 'Debug',
    tooltip: 'Debug test on debug console',
    command: TestifyCommand.debug,
    arguments: args
  }
})

function executeTestCommand(
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string,
  action: CodeLensAction
): void {
  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)
  const forwardSlashRelativeFileName = toForwardSlashPath(
    relative(workspaceFolder.uri.fsPath, fileName)
  )
  const testNameEscaped = escapeQuotesAndSpecialCharacters(testName)

  testRunner[action]({
    workspaceFolder,
    testName: testNameEscaped,
    fileName: forwardSlashRelativeFileName
  })
}

export const runTestCallback = (...args: TestCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Run)

export const watchTestCallback = (...args: TestCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Watch)

export const debugTestCallback = (...args: TestCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Debug)

function getCurrentWorkspaceFolder(): WorkspaceFolder | undefined {
  return window.activeTextEditor
    ? workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)
    : workspace.workspaceFolders?.[0]
}

export const rerunTestCallback = (): void => {
  const workspaceFolder = getCurrentWorkspaceFolder()
  if (!workspaceFolder) {
    window.showErrorMessage('No workspace folder found.')
    return
  }

  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)

  testRunner.rerunLastCommand(workspaceFolder)
}
