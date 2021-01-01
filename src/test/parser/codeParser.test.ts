//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import assert from "assert";
import { codeParser } from "../../parser/codeParser";

// Defines a Mocha test suite to group tests of similar kind together
suite("codeParser Tests", () => {
  // Defines a Mocha unit test
  test("Valid Token", () => {
    const code = `
            describe('Fake test', () => {});
        `;
    assert.equal(1, codeParser(code).length);
  });

  test("Invalid Tokens", () => {
    const code = `
            var test = 'Fluo';
            let src = {test: true, type: 'BANK'};
            if (!src.test && src.type === 'BANK') {
                let firstName = 'test';
            }
        `;
    assert.equal(0, codeParser(code).length);
  });

  test("Jsx syntax", () => {
    const code = `
        describe("JsonFormTextField", () => {

            test("Test render", () => {
                const config: ITextFieldConfig = {
                    fieldType: "text",
                    name: "Owner",
                };
                const wrapper = mount(<FormWrapper>
                    <JsonFormTextField
                        config={config}
                        value={null} />
                </FormWrapper>);
                const ownerInput = wrapper.find("input[type='text'][id='Owner']");
                expect(ownerInput.length).toBe(1);
                ownerInput.simulate("change");
            });
        });
        `;
    assert.equal(2, codeParser(code).length);
  });

  test("Decorator syntax", () => {
    const code = `
      describe("TestWithOptionalChaining", () => {
        it("just works", () => {
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
      })`;

    assert.equal(2, codeParser(code).length);
  });

  test("Rest Spread syntax", () => {
    const code = `
        describe("TestWithRestSpread", () => {
          it('just works!', () => {
            const obj = {
              name: 'Testify',
              catchphrase: 'Witness Me!',
            };

            const newObject = { ...obj };

            expect(newObject.catchphrase).toBe('Witness Me!');
          });
        });
      `;
    assert.equal(2, codeParser(code).length);
  });

  test("Optional Chaining syntax", () => {
    const code = `
      describe("TestWithOptionalChaining", () => {
        it("just works", () => {
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
      })`;

    assert.equal(2, codeParser(code).length);
  });

  test("Nullish Coalescing syntax", () => {
    const code = `
      describe("TestWithNullishCoalescing", () => {
        it("just works", () => {
          const createUser = username => {
            return username ?? 'No Name';
          }

          expect(createUser()).to.be.equal('No Name');
          expect(createUser('silvawillian')).to.be.equal('silvawillian');
        })
      })`;

    assert.equal(2, codeParser(code).length);
  });

  test("jest-each tests with template syntax", () => {
    const code = `
      describe("TestWithNullishCoalescing", () => {

        each\`p1 | p2\`.test("just works", () => {
          const createUser = username => {
            return username ?? 'No Name';
          }

          expect(createUser()).to.be.equal('No Name');
          expect(createUser('silvawillian')).to.be.equal('silvawillian');
        })
      })`;
    const p = codeParser(code);
    assert.equal(2, p.length);
    assert.equal("each", p[1].loc.identifierName);
  });

  test("jest-each tests with array syntax", () => {
    const code = `
      describe("TestWithNullishCoalescing", () => {

        each(["1","2"]).test("just works", (param) => {
          const createUser = username => {
            return username ?? 'No Name';
          }

          expect(createUser()).to.be.equal('No Name');
          expect(createUser('silvawillian')).to.be.equal('silvawillian');
        })
      })`;
    const p = codeParser(code);
    assert.equal(2, p.length);
    assert.equal("each", p[1].loc.identifierName);
  });

  test("is not triggered by regex test #32", () => {
    const code = `
      describe("TestWithNullishCoalescing", () => {

        test("just works", (param) => {
          const createUser = username => {
            return username ?? 'No Name';
          }
          const t = /test/g.test("test");

          expect(createUser()).to.be.equal('No Name');
          expect(createUser('silvawillian')).to.be.equal('silvawillian');
        })
      })`;
    const p = codeParser(code);
    assert.equal(2, p.length);
    assert.equal("test", p[1].loc.identifierName);
  });
});
