import {Command, TextDocument, TextEditor, window, workspace, WorkspaceFolder} from 'vscode'
import {parseSourceCode} from '../parser/parser'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {getTestRunner} from '../runners/test-runner-factory'
import {escapeQuotesAndSpecialCharacters, toForwardSlashPath} from '../utils/utils'

enum CommandActionEnum {
  Run = 'run',
  Watch = 'watch',
  Debug = 'debug',
  RunFile = 'runFile',
  WatchFile = 'watchFile',
  RunNearest = 'runNearest',
  WatchNearest = 'watchNearest',
  DebugNearest = 'debugNearest',
  Rerun = 'rerun'
}

type CommandAction = `${CommandActionEnum}`

export const TestifyCommands: Record<CommandAction, string> = {
  [CommandActionEnum.Run]: 'testify.run.test',
  [CommandActionEnum.Watch]: 'testify.watch.test',
  [CommandActionEnum.Debug]: 'testify.debug.test',
  [CommandActionEnum.RunFile]: 'testify.run.file',
  [CommandActionEnum.WatchFile]: 'testify.watch.file',
  [CommandActionEnum.RunNearest]: 'testify.run.nearest',
  [CommandActionEnum.WatchNearest]: 'testify.watch.nearest',
  [CommandActionEnum.DebugNearest]: 'testify.debug.nearest',
  [CommandActionEnum.Rerun]: 'testify.run.last'
}

type CodeLensAction = `${CommandActionEnum.Run | CommandActionEnum.Watch | CommandActionEnum.Debug}`

type CodeLensCommands = Record<CodeLensAction, Command>

type CodeLensCommandArguments = [
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
]

export const createCodeLensCommands = (...args: CodeLensCommandArguments): CodeLensCommands => ({
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
  const forwardSlashRelativeFileName = toForwardSlashPath(workspace.asRelativePath(fileName, false))
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

type ActiveEditorArgs = [
  workspaceFolder: WorkspaceFolder,
  document: TextDocument,
  editor: TextEditor
]

const withActiveEditor =
  <T extends unknown[]>(command: (...args: [...ActiveEditorArgs, ...T]) => void) =>
  (...args: T): void => {
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

    command(workspaceFolder, document, editor, ...args)
  }

type FileAction = `${CommandActionEnum.RunFile | CommandActionEnum.WatchFile}`

function executeFileCommand(
  workspaceFolder: WorkspaceFolder,
  document: TextDocument,
  action: FileAction
): void {
  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)
  const forwardSlashRelativeFileName = toForwardSlashPath(
    workspace.asRelativePath(document.fileName, false)
  )

  testRunner[action]({workspaceFolder, fileName: forwardSlashRelativeFileName})
}

const createFileCommand =
  (action: FileAction) =>
  (...[workspaceFolder, document]: ActiveEditorArgs) => {
    executeFileCommand(workspaceFolder, document, action)
  }

export const runTestFileCallback = withActiveEditor(createFileCommand(CommandActionEnum.RunFile))

export const watchTestFileCallback = withActiveEditor(createFileCommand(CommandActionEnum.WatchFile))

function findNearestTest(sourceCode: string, cursorLine: number): string | null {
  const tests = parseSourceCode(sourceCode)
  if (tests.length === 0) {
    return null
  }

  const nearestTest = tests.reduce((nearest, current) => {
    const currentDistance = Math.abs(current.loc.start.line - cursorLine)
    const nearestDistance = Math.abs(nearest.loc.start.line - cursorLine)
    return currentDistance < nearestDistance ? current : nearest
  })
  return nearestTest.title
}

type NearestTestAction =
  `${CommandActionEnum.Run | CommandActionEnum.Watch | CommandActionEnum.Debug}`

function executeNearestTestCommand(
  workspaceFolder: WorkspaceFolder,
  document: TextDocument,
  editor: TextEditor,
  action: NearestTestAction
): void {
  const sourceCode = document.getText()
  const cursorLine = editor.selection.active.line
  const nearestTestName = findNearestTest(sourceCode, cursorLine)
  if (!nearestTestName) {
    window.showErrorMessage('No tests found in this file.')
    return
  }

  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)
  const forwardSlashRelativeFileName = toForwardSlashPath(
    workspace.asRelativePath(document.fileName, false)
  )
  const testNameEscaped = escapeQuotesAndSpecialCharacters(nearestTestName)

  testRunner[action]({
    workspaceFolder,
    testName: testNameEscaped,
    fileName: forwardSlashRelativeFileName
  })
}

const createNearestTestCommand =
  (action: NearestTestAction) =>
  (...args: ActiveEditorArgs) =>
    executeNearestTestCommand(...args, action)

export const runNearestTestCallback = withActiveEditor(
  createNearestTestCommand(CommandActionEnum.Run)
)

export const watchNearestTestCallback = withActiveEditor(
  createNearestTestCommand(CommandActionEnum.Watch)
)

export const debugNearestTestCallback = withActiveEditor(
  createNearestTestCommand(CommandActionEnum.Debug)
)

const getCurrentWorkspaceFolder = (): WorkspaceFolder | undefined =>
  window.activeTextEditor
    ? workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)
    : workspace.workspaceFolders?.[0]

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

export const CommandCallbackMap = {
  [TestifyCommands.run]: runTestCallback,
  [TestifyCommands.watch]: watchTestCallback,
  [TestifyCommands.debug]: debugTestCallback,
  [TestifyCommands.runFile]: runTestFileCallback,
  [TestifyCommands.watchFile]: watchTestFileCallback,
  [TestifyCommands.runNearest]: runNearestTestCallback,
  [TestifyCommands.watchNearest]: watchNearestTestCallback,
  [TestifyCommands.debugNearest]: debugNearestTestCallback,
  [TestifyCommands.rerun]: rerunTestCallback
}
