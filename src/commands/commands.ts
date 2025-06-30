import {relative} from 'path'
import {Command, window, workspace, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {getTestRunner} from '../runners/test-runner-factory'
import {escapeQuotesAndSpecialCharacters, toForwardSlashPath} from '../utils/utils'

enum CommandActionEnum {
  Run = 'run',
  Watch = 'watch',
  Debug = 'debug',
  Rerun = 'rerun',
  RunFile = 'runFile',
  WatchFile = 'watchFile'
}

type CommandAction = `${CommandActionEnum}`

export const TestifyCommands: Record<CommandAction, string> = {
  [CommandActionEnum.Run]: 'testify.run.test',
  [CommandActionEnum.Watch]: 'testify.watch.test',
  [CommandActionEnum.Debug]: 'testify.debug.test',
  [CommandActionEnum.Rerun]: 'testify.run.last',
  [CommandActionEnum.RunFile]: 'testify.run.file',
  [CommandActionEnum.WatchFile]: 'testify.watch.file'
}

type CodeLensAction = `${CommandActionEnum.Run | CommandActionEnum.Watch | CommandActionEnum.Debug}`

type CodeLensCommands = Record<CodeLensAction, Command>

type CodeLensCommandArguments = [
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
]

export const buildCodeLensCommands = (...args: CodeLensCommandArguments): CodeLensCommands => ({
  [CommandActionEnum.Run]: {
    title: 'Run',
    tooltip: 'Run test',
    command: TestifyCommands.run,
    arguments: args
  },
  [CommandActionEnum.Watch]: {
    title: 'Watch',
    tooltip: 'Run test on watch mode',
    command: TestifyCommands.watch,
    arguments: args
  },
  [CommandActionEnum.Debug]: {
    title: 'Debug',
    tooltip: 'Debug test on debug console',
    command: TestifyCommands.debug,
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

export const runTestCallback = (...args: CodeLensCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Run)

export const watchTestCallback = (...args: CodeLensCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Watch)

export const debugTestCallback = (...args: CodeLensCommandArguments): void =>
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

export const runTestFileCallback = (): void => {
  const editor = window.activeTextEditor
  if (!editor) {
    window.showErrorMessage('No active editor found.')
    return
  }
  const document = editor.document
  const workspaceFolder = workspace.getWorkspaceFolder(document.uri)
  if (!workspaceFolder) {
    window.showErrorMessage('No workspace folder found for this file.')
    return
  }

  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)
  const forwardSlashRelativeFileName = toForwardSlashPath(
    workspace.asRelativePath(document.fileName, false)
  )

  testRunner.runFile({workspaceFolder, fileName: forwardSlashRelativeFileName})
}

export const watchTestFileCallback = (): void => {
  const editor = window.activeTextEditor
  if (!editor) {
    window.showErrorMessage('No active editor found.')
    return
  }
  const document = editor.document
  const workspaceFolder = workspace.getWorkspaceFolder(document.uri)
  if (!workspaceFolder) {
    window.showErrorMessage('No workspace folder found for this file.')
    return
  }

  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)
  const forwardSlashRelativeFileName = toForwardSlashPath(
    workspace.asRelativePath(document.fileName, false)
  )

  testRunner.watchFile({workspaceFolder, fileName: forwardSlashRelativeFileName})
}
