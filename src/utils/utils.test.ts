import assert from 'assert'
import {escapeQuotesAndSpecialCharacters} from './utils'

describe('utils', () => {
  describe('escapeQuotesAndSpecialCharacters', () => {
    it('should escape all special characters and double quotes in input string', () => {
      const text = 'special "string": .*+?^${}()|[]'

      const result = escapeQuotesAndSpecialCharacters(text)

      assert.equal(result, 'special \\"string\\": \\.\\*\\+\\?\\^\\\\$\\{\\}\\(\\)\\|\\[\\]')
    })
  })
})
