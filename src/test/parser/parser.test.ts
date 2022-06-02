import assert from 'assert'
import {parseSourceCode} from '../../parser/parser'

describe('parser', () => {
  context('given a source code with a valid test', () => {
    it('should find a test', () => {
      const testToken = 'it'
      const testTitle = 'a test'
      const sourceCode = `
        ${testToken}('${testTitle}', () => {
          const expected = 'value'

          const result = foo()

          expect(result).toEqual(expected)
        });
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 1)
      assert.equal(result[0].title, testTitle)
      assert.equal(result[0].loc.identifierName, testToken)
    })

    it('should find an async test', () => {
      const testToken = 'it'
      const testTitle = 'an async test'
      const sourceCode = `
        ${testToken}('${testTitle}', async () => {
          const expected = 'value'

          const result = await foo()

          expect(result).toEqual(expected)
        });
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 1)
      assert.equal(result[0].title, testTitle)
      assert.equal(result[0].loc.identifierName, testToken)
    })

    it('should find an empty test', () => {
      const testToken = 'it'
      const testTitle = 'empty test'
      const sourceCode = `
        ${testToken}('${testTitle}', () => {});
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 1)
      assert.equal(result[0].title, testTitle)
      assert.equal(result[0].loc.identifierName, testToken)
    })
  })

  context('given a source code with multiple valid test tokens', () => {
    it('should find all valid test tokens', () => {
      const describeToken = 'describe'
      const describeTitle = 'some description'
      const itToken = 'it'
      const itTitle = 'a test'
      const sourceCode = `
        ${describeToken}('${describeTitle}', () => {
          ${itToken}('${itTitle}', () => {
            const expected = 'value'

            const result = foo()

            expect(result).toEqual(expected)
          });
        })
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 2)
      assert.equal(result[0].loc.identifierName, describeToken)
      assert.equal(result[0].title, describeTitle)
      assert.equal(result[1].loc.identifierName, itToken)
      assert.equal(result[1].title, itTitle)
    })
  })

  context('given non test function token occurences of the word "test"', () => {
    it('should ignore properties with the name "test"', () => {
      const sourceCode = `
        const anObject = {test: true};
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 0)
    })

    it('should ignore variables with the name "test"', () => {
      const sourceCode = `
        const test = 'value';
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 0)
    })

    it('should ignore literals with the value "test"', () => {
      const sourceCode = `
        let aVariable = 'test'
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 0)
    })

    it('should ignore RegExp test function', () => {
      const sourceCode = `
        const t = /test/g.test("test");
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 0)
    })

    it('should ignore invalid tokens and find valid tokens', () => {
      const describeToken = 'describe'
      const describeTitle = 'some description'
      const testToken = 'test'
      const testTitle = 'a test'
      const sourceCode = `
        ${describeToken}('${describeTitle}', () => {
          ${testToken}('${testTitle}', () => {
            const test = {test: 'test'}

            const t = /test/g.test(test.test)

            expect(t).toEqual(true)
          })
        })
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 2)
      assert.equal(result.length, 2)
      assert.equal(result[0].loc.identifierName, describeToken)
      assert.equal(result[0].title, describeTitle)
      assert.equal(result[1].loc.identifierName, testToken)
      assert.equal(result[1].title, testTitle)
    })
  })

  context('given JavaScript special syntax', () => {
    it('shoud work with rest spread operator', () => {
      const describeToken = 'describe'
      const describeTitle = 'test with rest spread operator'
      const itToken = 'it'
      const itTitle = 'should work'
      const sourceCode = `
        ${describeToken}('${describeTitle}', () => {
          ${itToken}('${itTitle}', () => {
            const obj = {
              name: 'Testify',
              catchphrase:"It's right outside your door",
            };

            const newObject = { ...obj };

            expect(newObject.catchphrase).toBe("It's right outside your door");
          });
        });
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 2)
      assert.equal(result[0].loc.identifierName, describeToken)
      assert.equal(result[0].title, describeTitle)
      assert.equal(result[1].loc.identifierName, itToken)
      assert.equal(result[1].title, itTitle)
    })
  })

  context('given TypeScript special syntax', () => {
    it('should work with optional chaining syntax', () => {
      const describeToken = 'describe'
      const describeTitle = 'test with optional chaining'
      const itToken = 'it'
      const itTitle = 'should work'
      const sourceCode = `
        ${describeToken}('${describeTitle}', () => {
          ${itToken}('${itTitle}', () => {
            type OptionalParams = {
              name?: string;
              catchphrase?: string;
            }

            const obj: OptionalParams = {
              name: 'Testify',
            };

            const newObject = { ...obj };

            expect(newObject?.name).to.be.equal('Testify');
            expect(newObject?.catchphrase).toBeUndefined();
          })
        })
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 2)
      assert.equal(result[0].loc.identifierName, describeToken)
      assert.equal(result[0].title, describeTitle)
      assert.equal(result[1].loc.identifierName, itToken)
      assert.equal(result[1].title, itTitle)
    })

    it('should work with nullish coalescing operator', () => {
      const describeToken = 'describe'
      const describeTitle = 'test with nullish coalescing operator'
      const itToken = 'it'
      const itTitle = 'should work'
      const sourceCode = `
        ${describeToken}('${describeTitle}', () => {
          ${itToken}('${itTitle}', () => {
            const getUserName = username => username ?? 'No Name';

            expect(getUserName()).to.be.equal('No Name');
            expect(getUserName('Testify')).to.be.equal('Testify');
          })
        })
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 2)
      assert.equal(result[0].loc.identifierName, describeToken)
      assert.equal(result[0].title, describeTitle)
      assert.equal(result[1].loc.identifierName, itToken)
      assert.equal(result[1].title, itTitle)
    })

    it('should work with decorators', () => {
      const describeToken = 'describe'
      const describeTitle = 'test with nullish coalescing operator'
      const itToken = 'it'
      const itTitle = 'should work'
      const sourceCode = `
        ${describeToken}('${describeTitle}', () => {
          ${itToken}('${itTitle}', () => {
            type OptionalParams = {
              name?: string;
              catchphrase?: string;
            }
            function decorator(target: any) {
              void 0
            }
            @decorator
            class Obj {
              name: string
              constructor({ name, catchPhrase }: OptionalParams = { name: 'Testify' }){
                this.name = name
              }
            }
            const newObject = new Obj();
            expect(newObject?.name).to.be.equal('Testify');
            expect(newObject?.catchphrase).toBeUndefined();
          })
        })
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 2)
      assert.equal(result[0].loc.identifierName, describeToken)
      assert.equal(result[0].title, describeTitle)
      assert.equal(result[1].loc.identifierName, itToken)
      assert.equal(result[1].title, itTitle)
    })
  })

  context('given JSX special syntax', () => {
    it('should work with JSX syntax', () => {
      const describeToken = 'describe'
      const describeTitle = 'JsonFormTextField'
      const testToken = 'test'
      const testTitle = 'Test render'
      const sourceCode = `
        ${describeToken}("${describeTitle}", () => {
           ${testToken}("${testTitle}", () => {
            const config: ITextFieldConfig = {
              fieldType: "text",
              name: "Owner",
            };
            const wrapper = mount(
              <FormWrapper>
                <JsonFormTextField config={config} value={null}/>
              </FormWrapper>
            );
            const ownerInput = wrapper.find("input[type='text'][id='Owner']");
            expect(ownerInput.length).toBe(1);
            ownerInput.simulate("change");
          });
        });
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 2)
      assert.equal(result[0].loc.identifierName, describeToken)
      assert.equal(result[0].title, describeTitle)
      assert.equal(result[1].loc.identifierName, testToken)
      assert.equal(result[1].title, testTitle)
    })
  })

  context('given jest-each legacy library special syntax', () => {
    it('should work with jest-each tests with array syntax', () => {
      const sourceCode = `
        each([
          [1, 1, 2],
          [1, 2, 3],
          [2, 1, 3],
        ]).test('.add(%i, %i)', (a, b, expected) => {
          expect(a + b).toBe(expected);
        });
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 1)
      assert.equal(result[0].loc.identifierName, 'each')
      assert.equal(result[0].title, '.add(%i, %i)')
    })

    it('should work with jest-each tests with tagged template literal syntax', () => {
      const sourceCode = `
        each\`
          a    | b    | expected
          ${1} | ${1} | ${2}
          ${1} | ${2} | ${3}
          ${2} | ${1} | ${3}
        \`.test('returns $expected when $a is added $b', ({a, b, expected}) => {
          expect(a + b).toBe(expected);
        });
      `

      const result = parseSourceCode(sourceCode)

      assert.equal(result.length, 1)
      assert.equal(result[0].loc.identifierName, 'each')
      assert.equal(result[0].title, 'returns .* when .* is added .*')
    })
  })
})
