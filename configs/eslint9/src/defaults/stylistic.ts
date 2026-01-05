import type { AntFuFormatterConfig, AntFuStylisticConfig } from '../types'

export const defaultStylisticConfig: AntFuStylisticConfig = {
  jsx: true,
  indent: 2,
  quotes: 'single',
  semi: false,
  overrides: {
    'style/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    'style/brace-style': ['error', '1tbs'],
    'style/arrow-parens': ['error', 'always'],
  },
}

export const defaultFormatterConfig: AntFuFormatterConfig = {
  css: 'prettier',
  html: 'prettier',
  prettierOptions: {
    printWidth: 160,
    tabWidth: 2,
    arrowParens: 'always',
    vueIndentScriptAndStyle: true,
    useTabs: false,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
  },
}
