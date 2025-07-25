import {Command, WorkspaceFolder} from 'vscode'
import {CommandActionEnum, FileAction, TestAction, TestifyCommands} from './actions'
import {withActiveEditor, withActiveWorkspace, withNearestTest, withTestRunner} from './context'
import {executeCommand} from './execute'

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

const createTestCallback =
  (action: TestAction) =>
  (...[workspaceFolder, fileName, testName]: CodeLensCommandArguments): void =>
    withTestRunner(context =>
      executeCommand({...context, action, workspaceFolder, fileName, testName})
    )({workspaceFolder})

const runTestCallback = createTestCallback(CommandActionEnum.Run)
const watchTestCallback = createTestCallback(CommandActionEnum.Watch)
const debugTestCallback = createTestCallback(CommandActionEnum.Debug)

const createTestFileCallback = (action: FileAction) =>
  withActiveEditor(activeEditorContext =>
    withTestRunner(testRunnerContext =>
      executeCommand({
        ...testRunnerContext,
        action,
        fileName: activeEditorContext.document.fileName,
        workspaceFolder: activeEditorContext.workspaceFolder
      })
    )
  )

const runTestFileCallback = createTestFileCallback(CommandActionEnum.RunFile)
const watchTestFileCallback = createTestFileCallback(CommandActionEnum.WatchFile)

const createNearestTestCallback = (action: TestAction) =>
  withActiveEditor(
    withNearestTest(nearestTestContext =>
      withTestRunner(testRunnerContext =>
        executeCommand({
          ...nearestTestContext,
          ...testRunnerContext,
          action
        })
      )
    )
  )

const runNearestTestCallback = createNearestTestCallback(CommandActionEnum.Run)
const watchNearestTestCallback = createNearestTestCallback(CommandActionEnum.Watch)
const debugNearestTestCallback = createNearestTestCallback(CommandActionEnum.Debug)

const rerunTestCallback = withActiveWorkspace(
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
