import assert from 'assert'
import {escapeQuotesAndSpecialCharacters, isNodePath, toForwardSlashPath} from './utils'

describe('utils', () => {
  describe('escapeQuotesAndSpecialCharacters', () => {
    const testCases = [
      {
        input: 'No quotes or special characters',
        expected: 'No quotes or special characters'
      },
      {
        input: 'With "double quotes"',
        expected: 'With \\"double quotes\\"'
      },
      {
        input: 'With special characters at the end: .*+?^${}()|[]',
        expected: 'With special characters at the end: \\.\\*\\+\\?\\^\\\\$\\{\\}\\(\\)\\|\\[\\]'
      },
      {
        input: 'With spaced special characters: \\ ^ $ * + ? . ( ) [ ] { } |',
        expected:
          'With spaced special characters: \\\\ \\^ \\\\$ \\* \\+ \\? \\. \\( \\) \\[ \\] \\{ \\} \\|'
      },
      {
        input: '.*+?^${}()|[] With special characters at the start',
        expected: '\\.\\*\\+\\?\\^\\\\$\\{\\}\\(\\)\\|\\[\\] With special characters at the start'
      },
      {
        input: 'With "double quotes" and special characters: .*+?^${}()|[]',
        expected:
          'With \\"double quotes\\" and special characters: \\.\\*\\+\\?\\^\\\\$\\{\\}\\(\\)\\|\\[\\]'
      }
    ]

    testCases.forEach(({input, expected}) => {
      it(`should return \n\t${expected} \n\twhen input is \n\t${input}`, () => {
        assert.strictEqual(escapeQuotesAndSpecialCharacters(input), expected)
      })
    })
  })

  describe('toForwardSlashPath', () => {
    const testCases = [
      {
        input: 'C:\\Users\\User\\Documents\\file.txt',
        expected: 'C:/Users/User/Documents/file.txt'
      },
      {
        input: 'src/utils/utils.test.ts',
        expected: 'src/utils/utils.test.ts'
      },
      {
        input: 'src\\utils\\utils.test.ts',
        expected: 'src/utils/utils.test.ts'
      },
      {
        input: 'C:\\Users\\User\\Documents\\folder\\subfolder\\file.txt',
        expected: 'C:/Users/User/Documents/folder/subfolder/file.txt'
      },
      {
        input: 'C:\\Users\\User\\Documents\\file with spaces.txt',
        expected: 'C:/Users/User/Documents/file with spaces.txt'
      },
      {
        input: 'src\\utils\\file_with_underscores.test.ts',
        expected: 'src/utils/file_with_underscores.test.ts'
      },
      {
        input: 'C:\\Users\\User\\Documents\\file-with-dashes.txt',
        expected: 'C:/Users/User/Documents/file-with-dashes.txt'
      },
      {
        input: 'C:\\Users\\User\\Documents\\file@with@ats.txt',
        expected: 'C:/Users/User/Documents/file@with@ats.txt'
      }
    ]

    testCases.forEach(({input, expected}) => {
      it(`should return \n\t${expected} \n\twhen path is \n\t${input}`, () => {
        assert.strictEqual(toForwardSlashPath(input), expected)
      })
    })
  })

  describe('isNodePath', () => {
    const testCases = [
      {input: '/usr/local/bin/node', expected: true},
      {input: '/usr/bin/node', expected: true},
      {input: '/opt/homebrew/bin/node', expected: true},
      {input: '/snap/bin/node', expected: true},
      {input: '/Users/felixjb/.nvm/versions/node/v18.17.0/bin/node', expected: true},
      {input: '/usr/local/n/versions/node/18.17.0/bin/node', expected: true},
      {input: '/Users/felixjb/.asdf/installs/nodejs/18.17.0/bin/node', expected: true},
      {input: 'C:\\Program Files\\nodejs\\node.exe', expected: true},
      {input: 'C:\\Users\\felixjb\\.nvs\\node\\18.17.0\\x64\\node.exe', expected: true},
      {input: 'C:\\Users\\felixjb\\.volta\\tools\\image\\node\\18.17.0\\node.exe', expected: true},
      {input: 'C:\\Users\\felixjb\\AppData\\Roaming\\npm\\node.exe', expected: true},
      {input: '/opt/local/bin/node', expected: true},
      {input: './node', expected: true},
      {input: '/usr/local/bin/python', expected: false},
      {input: '/usr/bin/python', expected: false},
      {input: '/opt/homebrew/bin/python', expected: false},
      {input: '/snap/bin/python', expected: false},
      {input: '/Users/felixjb/.nvm/versions/python/v3.9.1/bin/python', expected: false},
      {input: '/usr/local/n/versions/python/3.9.1/bin/python', expected: false},
      {input: '/Users/felixjb/.asdf/installs/python/3.9.1/bin/python', expected: false},
      {input: 'C:\\Program Files\\python\\python.exe', expected: false},
      {input: 'C:\\Users\\felixjb\\.nvs\\python\\3.9.1\\x64\\python.exe', expected: false},
      {input: 'C:\\Users\\felixjb\\AppData\\Roaming\\npm\\python.exe', expected: false},
      {input: 'node_modules/.bin/jest', expected: false},
      {input: 'node_modules/.bin/mocha', expected: false},
      {input: 'node_modules/.bin/ava', expected: false},
      {input: 'node_modules/.bin/playwright', expected: false},
      {input: 'node_modules/.bin/vitest', expected: false}
    ]

    testCases.forEach(({input, expected}) => {
      it(`should return ${expected} when path is ${input}`, () => {
        assert.strictEqual(isNodePath(input), expected)
      })
    })
  })
})
