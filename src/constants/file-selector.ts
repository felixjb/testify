import type {DocumentFilter} from 'vscode'

export const FILE_SELECTOR: DocumentFilter[] = [
  {
    language: 'typescript',
    scheme: 'file'
  },
  {
    language: 'typescriptreact',
    scheme: 'file'
  },
  {
    language: 'javascript',
    scheme: 'file'
  },
  {
    language: 'javascriptreact',
    scheme: 'file'
  },
  {
    language: 'vue',
    scheme: 'file'
  }
]
