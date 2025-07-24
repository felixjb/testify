import {TextDocument, TextEditor, window, workspace, WorkspaceFolder} from 'vscode'
import {parseSourceCode} from '../parser/parser'
import {ConfigurationProvider} from '../providers/configuration-provider'
import {TestRunner} from '../runners/test-runner'
import {getTestRunner} from '../runners/test-runner-factory'

export type ActiveEditorContext = {
  workspaceFolder: WorkspaceFolder
  document: TextDocument
  editor: TextEditor
}

export const withActiveEditor = (command: (context: ActiveEditorContext) => void) => (): void => {
  const editor = window.activeTextEditor
  if (!editor) {
    window.showErrorMessage('No active editor found.')
    return
  }
  const document = editor.document
  const workspaceFolder = workspace.getWorkspaceFolder(document.uri)
  if (!workspaceFolder) {
    window.showErrorMessage('No workspace folder found for this file.')
    return
  }

  command({workspaceFolder, document, editor})
}

export const withActiveWorkspace =
  (command: (workspaceFolder: WorkspaceFolder) => void) => (): void => {
    const workspaceFolder = window.activeTextEditor
      ? workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)
      : workspace.workspaceFolders?.[0]
    if (!workspaceFolder) {
      window.showErrorMessage('No workspace folder found.')
      return
    }

    command(workspaceFolder)
  }

export const withTestRunner =
  (command: (context: {workspaceFolder: WorkspaceFolder; testRunner: TestRunner}) => void) =>
  (workspaceFolder: WorkspaceFolder): void => {
    const configurationProvider = new ConfigurationProvider(workspaceFolder)
    const testRunner = getTestRunner(configurationProvider, workspaceFolder)

    command({workspaceFolder, testRunner})
  }

export function findNearestTest(sourceCode: string, cursorLine: number): string | null {
  const tests = parseSourceCode(sourceCode)
  if (tests.length === 0) {
    return null
  }

  const nearestTest = tests.reduce((nearest, current) => {
    const currentDistance = Math.abs(current.loc.start.line - cursorLine)
    const nearestDistance = Math.abs(nearest.loc.start.line - cursorLine)
    return currentDistance < nearestDistance ? current : nearest
  })
  return nearestTest.title
}

export type NearestTestContext = {
  workspaceFolder: WorkspaceFolder
  fileName: string
  testName: string
}

export const withNearestTest =
  (command: (context: NearestTestContext) => void) =>
  ({
    workspaceFolder,
    document,
    editor
  }: {
    workspaceFolder: WorkspaceFolder
    document: TextDocument
    editor: TextEditor
  }): void => {
    const sourceCode = document.getText()
    const cursorLine = editor.selection.active.line
    const nearestTestName = findNearestTest(sourceCode, cursorLine)
    if (!nearestTestName) {
      window.showErrorMessage('No tests found in this file.')
      return
    }

    command({
      workspaceFolder,
      fileName: document.fileName,
      testName: nearestTestName
    })
  }
