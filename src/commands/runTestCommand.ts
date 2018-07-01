import { window, workspace, Terminal, TerminalOptions, debug } from 'vscode'

import { getTestRunner } from '../utils/runner'
import { TestRunner } from '../types/TestRunner'

let term: Terminal = null

function _getNewTerminal(envVars: {}): Terminal {
    const terminalOptions: TerminalOptions = {
        env: envVars
    }

    if (term) {
        term.dispose()
    }

    term = window.createTerminal(terminalOptions)

    return term
}

async function runTest (testName, rootPath, fileName, isDebug = false) {
    const testRunner = await getTestRunner(rootPath)
    const additionalArgs: string = workspace.getConfiguration("javascript-test-runner").get("additionalArgs")
    const envVars = workspace.getConfiguration("javascript-test-runner").get("envVars")
    const term = _getNewTerminal(envVars)

    if (isDebug) {
        debug.startDebugging(rootPath, {
            name: 'Debug Test',
            type: "node",
            request: "launch",
            program: testRunner === TestRunner.jest
                ? "${workspaceFolder}/node_modules/.bin/jest"
                : "${workspaceFolder}/node_modules/.bin/mocha",
            args: [
                fileName,
                testRunner === TestRunner.jest ? "--testNamePattern" : "--grep",
                testName,
                testRunner === TestRunner.jest ? "--runInBand" : "--no-timeouts",
                ...additionalArgs.split(' ')
            ],
            internalConsoleOptions: "openOnSessionStart",
            env: envVars,
        })
    } else {
        const commandLine = testRunner === TestRunner.jest
            ? `${rootPath}/node_modules/.bin/jest ${fileName} --testNamePattern="${testName}" ${additionalArgs}`
            : `${rootPath}/node_modules/.bin/mocha ${fileName} --grep="${testName}" ${additionalArgs}`


        term.sendText(commandLine, true)
        term.show(true)
    }

}


export default runTest
