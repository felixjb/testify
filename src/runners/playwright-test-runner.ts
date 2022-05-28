import {join} from 'path'
import {debug, WorkspaceFolder} from 'vscode'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TerminalProvider} from '../providers/terminal-provider'
import {TestRunner} from './test-runner'

export class PlaywrightTestRunner implements TestRunner {
  public name = 'playwright'
  public path: string = join('node_modules', '.bin', this.name)
  public terminalProvider: TerminalProvider
  public configurationProvider: ConfigurationProvider

  constructor(
    configurationProvider: ConfigurationProvider,
    terminalProvider: TerminalProvider,
    path?: string
  ) {
    this.terminalProvider = terminalProvider
    this.configurationProvider = configurationProvider

    if (path) {
      this.path = path
    }
  }

  public runTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments
    const environmentVariables = this.configurationProvider.environmentVariables

    const command = `${
      this.path
    } test -g "${testName}" ${additionalArguments} ${this.transformFileName(fileName)}`

    const terminal = this.terminalProvider.get({env: environmentVariables}, rootPath)

    terminal.sendText(command, true)
    terminal.show(true)
  }

  public debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments
    const environmentVariables = this.configurationProvider.environmentVariables
    const skipFiles = this.configurationProvider.skipFiles

    debug.startDebugging(rootPath, {
      args: [
        'test',
        '-g',
        testName,
        ...additionalArguments.split(' '),
        this.transformFileName(fileName)
      ],
      console: 'integratedTerminal',
      env: {
        ...{PLAYWRIGHT_CHROMIUM_DEBUG_PORT: 9222, PWDEBUG: true},
        ...environmentVariables
      },
      name: 'Debug Test',
      program: join(rootPath.uri.fsPath, this.path),
      request: 'launch',
      skipFiles,
      type: 'node'
    })
  }

  // We force slash instead of backslash for Windows
  private transformFileName(fileName: string) {
    return fileName.replace(/\\/g, '/')
  }
}
