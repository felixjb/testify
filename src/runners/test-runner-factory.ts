import {existsSync} from 'fs'
import {basename, resolve} from 'path'
import {WorkspaceFolder} from 'vscode'
import which from 'which'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {isNodePath} from '../utils/utils'
import {AvaTestRunner} from './ava-test-runner'
import {JestTestRunner} from './jest-test-runner'
import {MochaTestRunner} from './mocha-test-runner'
import {NodeTestRunner} from './node-test-runner'
import {PlaywrightTestRunner} from './playwright-test-runner'
import {TestRunner} from './test-runner'
import {VitestTestRunner} from './vitest-test-runner'

type TestRunnerImplClass =
  | typeof AvaTestRunner
  | typeof JestTestRunner
  | typeof MochaTestRunner
  | typeof PlaywrightTestRunner
  | typeof VitestTestRunner

const TEST_RUNNERS: Record<string, TestRunnerImplClass> = {
  ava: AvaTestRunner,
  jest: JestTestRunner,
  mocha: MochaTestRunner,
  playwright: PlaywrightTestRunner,
  vitest: VitestTestRunner
}

function getCustomTestRunner(
  configurationProvider: ConfigurationProvider,
  workspaceFolder: WorkspaceFolder
): TestRunner | never {
  const executablePath = configurationProvider.executablePath
  const executableExists = existsSync(resolve(workspaceFolder.uri.fsPath, executablePath))
  if (!executableExists) {
    throw new Error(
      `Test runner executable not found at: ${executablePath}. Please verify the \`executablePath\` configuration.`
    )
  }

  if (isNodePath(executablePath)) {
    return new NodeTestRunner(configurationProvider, executablePath)
  }

  const testRunnerName = basename(executablePath).replace('_', '').toLowerCase()
  const TestRunner = TEST_RUNNERS[testRunnerName]
  if (!TestRunner) {
    throw new Error(
      `Unsupported test runner: ${testRunnerName}. Please use one of the supported ones: ${Object.keys(TEST_RUNNERS).concat('node').join(', ')}.`
    )
  }

  const entryPointPath = configurationProvider.entryPointPath
  const entryPointExists = existsSync(resolve(workspaceFolder.uri.fsPath, entryPointPath))
  if (!entryPointExists) {
    throw new Error(
      `Test runner entry point not found at: ${entryPointPath}. Please verify the \`entryPointPath\` configuration.`
    )
  }

  return new TestRunner(configurationProvider, executablePath, entryPointPath)
}

function getAvailableTestRunner(
  configurationProvider: ConfigurationProvider,
  workspaceFolder: WorkspaceFolder
): TestRunner | never {
  for (const TestRunner of Object.values(TEST_RUNNERS)) {
    const runner = new TestRunner(configurationProvider)
    const executableExists = existsSync(resolve(workspaceFolder.uri.fsPath, runner.executablePath))
    if (executableExists) {
      return runner
    }
  }

  const nodePath = which.sync('node', {nothrow: true})
  if (nodePath !== null) {
    return new NodeTestRunner(configurationProvider, nodePath)
  }

  throw new Error('No supported test runner found. Please install one.')
}

export function getTestRunner(
  configurationProvider: ConfigurationProvider,
  workspaceFolder: WorkspaceFolder
): TestRunner | never {
  return configurationProvider.executablePath
    ? getCustomTestRunner(configurationProvider, workspaceFolder)
    : getAvailableTestRunner(configurationProvider, workspaceFolder)
}
