import {existsSync} from 'fs'
import {basename, join} from 'path'
import {WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {AvaTestRunner} from './ava-test-runner'
import {JestTestRunner} from './jest-test-runner'
import {MochaTestRunner} from './mocha-test-runner'
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
  playwright: PlaywrightTestRunner,
  vitest: VitestTestRunner
}

function getCustomTestRunner(workspaceFolder: WorkspaceFolder, path: string): TestRunner {
  const executablePath = join(workspaceFolder.uri.fsPath, path)
  if (!existsSync(executablePath)) {
    throw new Error(`No test runner in specified path: ${path}. Please verify it.`)
  }

  const name = basename(path).replace('_', '').toLowerCase()
  const TestRunner = TEST_RUNNERS[name]
  if (!TestRunner) {
    throw new Error(`Unsupported test runner: ${name}. Please use one of the supported ones.`)
  }

  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  return new TestRunner(configurationProvider, path)
}

function getAvailableTestRunner(workspaceFolder: WorkspaceFolder): TestRunner {
  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunners = [
    new AvaTestRunner(configurationProvider),
    new JestTestRunner(configurationProvider),
    new MochaTestRunner(configurationProvider),
    new PlaywrightTestRunner(configurationProvider),
    new VitestTestRunner(configurationProvider)
  ]

  const foundTestRunner = testRunners.find(runner =>
    existsSync(join(workspaceFolder.uri.fsPath, runner.path))
  )
  if (!foundTestRunner) {
    throw new Error('No supported test runner found. Please install one.')
  }

  return foundTestRunner
}

export function getTestRunner(workspaceFolder: WorkspaceFolder): TestRunner {
  const configurationProvider = new ConfigurationProvider(workspaceFolder)
  const testRunnerPath = configurationProvider.testRunnerPath

  return testRunnerPath
    ? getCustomTestRunner(workspaceFolder, testRunnerPath)
    : getAvailableTestRunner(workspaceFolder)
}
