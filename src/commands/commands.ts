import {relative} from 'path'
import {Command, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {getTestRunner} from '../runners/test-runner-factory'

enum CommandActionEnum {
  Run = 'run',
  Watch = 'watch',
  Debug = 'debug'
}

type CommandAction = `${CommandActionEnum}`

export const TestifyCommand: Record<CommandAction, string> = {
  [CommandActionEnum.Run]: 'testify.run.test',
  [CommandActionEnum.Watch]: 'testify.watch.test',
  [CommandActionEnum.Debug]: 'testify.debug.test'
} as const

type TestCommands = Record<CommandAction, Command>

export type TestCommandArguments = [
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string
]

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

export function executeTestCommand(
  workspaceFolder: WorkspaceFolder,
  fileName: string,
  testName: string,
  action: CommandAction
): void {
  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunner = getTestRunner(configurationProvider, workspaceFolder)
  const relativeFileName = relative(workspaceFolder.uri.fsPath, fileName)

  testRunner[action]({workspaceFolder, testName, fileName: relativeFileName})
}

export const runTestCallback = (...args: TestCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Run)

export const watchTestCallback = (...args: TestCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Watch)

export const debugTestCallback = (...args: TestCommandArguments): void =>
  executeTestCommand(...args, CommandActionEnum.Debug)
