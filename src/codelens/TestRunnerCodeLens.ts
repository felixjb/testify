import { CodeLens, Range, Command } from 'vscode'

export default class TestRunnerCodeLens extends CodeLens {
    constructor(range: Range, testName: string, rootPath: string, fileName: string) {
        super(range, {
            title: 'Run Test',
            command: 'javascript-test-runner.run.test',
            arguments: [testName, rootPath, fileName]
        })
    }
}
