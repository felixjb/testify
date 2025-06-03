import {existsSync} from 'fs'
import {basename, join} from 'path'
import {WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {AvaTestRunner} from './ava-test-runner'
import {JestTestRunner} from './jest-test-runner'
import {MochaTestRunner} from './mocha-test-runner'
import {NodeTestRunner} from './node-test-runner'
import {PlaywrightTestRunner} from './playwright-test-runner'
import {TestRunner} from './test-runner'
import {VitestTestRunner} from './vitest-test-runner'

const TEST_RUNNERS: Record<
  string,
  new (configurationProvider: ConfigurationProvider, path?: string) => TestRunner
> = {
  ava: AvaTestRunner,
  jest: JestTestRunner,
  mocha: MochaTestRunner,
  node: NodeTestRunner,
  playwright: PlaywrightTestRunner,
  vitest: VitestTestRunner
} as const

function getCustomTestRunner(
  configurationProvider: ConfigurationProvider,
  workspaceFolder: WorkspaceFolder
): TestRunner | never {
  const testRunnerPath = configurationProvider.testRunnerPath
  const executableRelativePath = join(workspaceFolder.uri.fsPath, testRunnerPath)
  if (!existsSync(executableRelativePath) && !existsSync(testRunnerPath)) {
    throw new Error(`No test runner in specified path: ${testRunnerPath}. Please verify it.`)
  }

  const testRunnerName = basename(testRunnerPath).replace('_', '').toLowerCase()
  const TestRunner = TEST_RUNNERS[testRunnerName]
  if (!TestRunner) {
    throw new Error(
      `Unsupported test runner: ${testRunnerName}. Please use one of the supported ones.`
    )
  }

  return new TestRunner(configurationProvider, testRunnerPath)
}

function getAvailableTestRunner(
  configurationProvider: ConfigurationProvider,
  workspaceFolder: WorkspaceFolder
): TestRunner {
  for (const TestRunner of Object.values(TEST_RUNNERS)) {
    const runner = new TestRunner(configurationProvider)
    if (existsSync(join(workspaceFolder.uri.fsPath, runner.path))) {
      return runner
    }
  }

  const nodeTestRunner = new NodeTestRunner(configurationProvider)
  if (existsSync(nodeTestRunner.path)) {
    return nodeTestRunner
  }

  throw new Error('No supported test runner found. Please install one.')
}

export function getTestRunner(
  configurationProvider: ConfigurationProvider,
  workspaceFolder: WorkspaceFolder
): TestRunner {
  return configurationProvider.testRunnerPath
    ? getCustomTestRunner(configurationProvider, workspaceFolder)
    : getAvailableTestRunner(configurationProvider, workspaceFolder)
}
