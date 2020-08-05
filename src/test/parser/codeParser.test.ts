//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

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
});
