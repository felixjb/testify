import { CodeLensProvider, TextDocument, CancellationToken, CodeLens, Position, Range, Uri, workspace } from "vscode"

import TestRunnerCodeLens from "../codelens/TestRunnerCodeLens"
import TestDebugRunnerCodeLens from "../codelens/TestDebugRunnerCodeLens"
import { codeParser } from "../parser/codeParser"

function _getRootPath({uri}) {
    const fileUri = Uri.parse(uri.path)
    const activeWorkspace = workspace.getWorkspaceFolder(fileUri)

    if (activeWorkspace) {
        return activeWorkspace.uri.path
    }

    return workspace.rootPath
}

export default class TestRunnerCodeLensProvider implements CodeLensProvider {
    public provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
        const createRangeObject = ({line}) => document.lineAt(line - 1).range
        const rootPath = _getRootPath(document)

        return codeParser(document.getText())
            .reduce((acc, {loc, testName}) => {
                acc.push(new TestRunnerCodeLens(
                    createRangeObject(loc.start),
                    testName,
                    rootPath,
                    document.fileName
                ))
                acc.push(new TestDebugRunnerCodeLens(
                    createRangeObject(loc.start),
                    testName,
                    rootPath,
                    document.fileName
                ))
                return acc
            }, [])
    }

    public resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): CodeLens | Thenable<CodeLens> {
        return
    }
}
