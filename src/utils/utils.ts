export const escapeCharacter = (text: string, character: string): string =>
  text.replace(new RegExp(character, 'g'), `\\${character}`)
