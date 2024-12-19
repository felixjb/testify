import type {DebugConfiguration} from 'vscode'

export const COMMON_DEBUG_CONFIG: DebugConfiguration = {
  name: 'Testify: Debug Test',
  type: 'node',
  request: 'launch',
  console: 'internalConsole',
  internalConsoleOptions: 'openOnSessionStart',
  outputCapture: 'std',
  autoAttachChildProcesses: true,
  smartStep: true
}
