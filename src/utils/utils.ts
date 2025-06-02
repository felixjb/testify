import {spawn} from 'child_process'
import which from 'which'

export const escapeQuotesAndSpecialCharacters = (text: string): string =>
  text.replace(/[.*+?^"${}()|[\]\\]/g, '\\$&').replace(/[$]/g, '\\$')

export const convertFilePathToWindows = (fileName: string): string => fileName.replace(/\\/g, '/')

let pathToNodeJS: string | undefined

export async function findNode(shell: string, cwd: string): Promise<string> {
  if (pathToNodeJS) return pathToNodeJS

  // Stage 1: Try to find Node.js via process.env.PATH
  let node: string | undefined = await which('node').catch()
  // Stage 2: When extension host boots, it does not have the right env set, so we might need to wait.
  for (let i = 0; i < 5 && !node; ++i) {
    await new Promise(f => setTimeout(f, 200))
    node = await which('node').catch()
  }
  // Stage 3: If we still haven't found Node.js, try to find it via a subprocess.
  // This evaluates shell rc/profile files and makes nvm work.
  node ??= await findNodeViaShell(shell, cwd)
  if (!node)
    throw new Error(
      `Unable to find 'node' executable.\nMake sure to have Node.js installed and available in your PATH.\nCurrent PATH: '${process.env.PATH}'.`
    )
  pathToNodeJS = node
  return node
}

async function findNodeViaShell(shell: string, cwd: string): Promise<string | undefined> {
  if (process.platform === 'win32') return undefined
  return new Promise<string | undefined>(resolve => {
    const startToken = '___START_PW_SHELL__'
    const endToken = '___END_PW_SHELL__'
    // NVM lazily loads Node.js when 'node' alias is invoked. In order to invoke it, we run 'node --version' if 'node' is a function.
    // See https://github.com/microsoft/playwright/issues/33996
    const childProcess = spawn(
      `${shell} -i -c 'if [[ $(type node 2>/dev/null) == *function* ]]; then node --version; fi; echo ${startToken} && which node && echo ${endToken}'`,
      {
        stdio: 'pipe',
        shell: true,
        cwd
      }
    )
    let output = ''
    childProcess.stdout.on('data', data => (output += data.toString()))
    childProcess.on('error', () => resolve(undefined))
    childProcess.on('exit', exitCode => {
      if (exitCode !== 0) return resolve(undefined)
      const start = output.indexOf(startToken)
      const end = output.indexOf(endToken)
      if (start === -1 || end === -1) return resolve(undefined)
      return resolve(output.substring(start + startToken.length, end).trim())
    })
  })
}
