//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert'

import { codeParser } from '../../parser/codeParser'

// Defines a Mocha test suite to group tests of similar kind together
suite('codeParser Tests', () => {
    // Defines a Mocha unit test
    test('Valid Token', () => {
        const code = `
            describe('Fake test', () => {});
        `
        assert.equal(1, codeParser(code).length)
    })

    test('Invalid Tokens', () => {
        const code = `
            var test = 'Fluo';
            let src = {test: true, type: 'BANK'};
            if (!src.test && src.type === 'BANK') {
                let firstName = 'test';
            }
        `
        assert.equal(0, codeParser(code).length)
    })
})
