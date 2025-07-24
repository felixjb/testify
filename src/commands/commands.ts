import {Command, workspace, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {getTestRunner} from '../runners/test-runner-factory'
import {escapeQuotesAndSpecialCharacters, toForwardSlashPath} from '../utils/utils'
import {withActiveEditor, withActiveWorkspace, withNearestTest, withTestRunner} from './with'

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

export type CommandAction = `${CommandActionEnum}`

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

export type TestAction =
  `${CommandActionEnum.Run | CommandActionEnum.Watch | CommandActionEnum.Debug}`

type CodeLensCommands = Record<TestAction, Command>

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

type TestCommandContext = {
  action: TestAction
  workspaceFolder: WorkspaceFolder
  fileName: string
  testName: string
}

export type FileAction = `${CommandActionEnum.RunFile | CommandActionEnum.WatchFile}`

type FileCommandContext = {
  action: FileAction
  workspaceFolder: WorkspaceFolder
  fileName: string
}

export function executeCommand(context: TestCommandContext | FileCommandContext): void {
  const {workspaceFolder, fileName} = context

  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)
  const forwardSlashRelativeFileName = toForwardSlashPath(workspace.asRelativePath(fileName, false))

  return 'testName' in context
    ? testRunner[context.action]({
        workspaceFolder,
        fileName: forwardSlashRelativeFileName,
        testName: escapeQuotesAndSpecialCharacters(context.testName)
      })
    : testRunner[context.action]({workspaceFolder, fileName: forwardSlashRelativeFileName})
}

const createTestCommand =
  (action: TestAction) =>
  (...[workspaceFolder, fileName, testName]: CodeLensCommandArguments): void =>
    executeCommand({workspaceFolder, fileName, testName, action})

export const runTestCallback = createTestCommand(CommandActionEnum.Run)
export const watchTestCallback = createTestCommand(CommandActionEnum.Watch)
export const debugTestCallback = createTestCommand(CommandActionEnum.Debug)

const createTestFileCallback = (action: FileAction) =>
  withActiveEditor(context =>
    executeCommand({...context, action, fileName: context.document.fileName})
  )

export const runTestFileCallback = createTestFileCallback(CommandActionEnum.RunFile)
export const watchTestFileCallback = createTestFileCallback(CommandActionEnum.WatchFile)

const createNearestTestCallback = (action: TestAction) =>
  withActiveEditor(withNearestTest(context => executeCommand({...context, action})))

export const runNearestTestCallback = createNearestTestCallback(CommandActionEnum.Run)
export const watchNearestTestCallback = createNearestTestCallback(CommandActionEnum.Watch)
export const debugNearestTestCallback = createNearestTestCallback(CommandActionEnum.Debug)

export const rerunTestCallback = withActiveWorkspace(
  withTestRunner(({workspaceFolder, testRunner}) => testRunner.rerunLastCommand(workspaceFolder))
)

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
