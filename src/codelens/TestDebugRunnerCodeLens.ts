import { CodeLens, Range, Command } from 'vscode'

export default class TestDebugRunnerCodeLens extends CodeLens {
    constructor(range: Range, testName: string, rootPath: string, fileName: string) {
        super(range, {
            title: 'Debug Test',
            command: 'javascript-test-runner.debug.test',
            arguments: [testName, rootPath, fileName, true]
        })
    }
}
