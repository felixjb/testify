import { window, workspace, Terminal, debug } from 'vscode'

import { getTestRunner } from '../utils/runner'
import { TestRunner } from '../types/TestRunner'

let term: Terminal = null

function _getNewTerminal(): Terminal {
    if (term) {
        term.dispose()
    }

    term = window.createTerminal()

    return term
}

async function runTest (testName, rootPath, fileName, isDebug = false) {
    const testRunner = await getTestRunner(rootPath)
    const additionalArgs: string = workspace.getConfiguration("javascript-test-runner").get("additionalArgs")
    const term = _getNewTerminal()

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
                testRunner === TestRunner.jest ? "--runInBand" : "--no-timeouts",
                testName,
                ...additionalArgs.split(' ')
            ],
            internalConsoleOptions: "openOnSessionStart"
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
