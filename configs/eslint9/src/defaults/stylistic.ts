import type { AntFuFormatterConfig, AntFuStylisticConfig } from '../types'

export const defaultStylisticConfig: AntFuStylisticConfig = {
  jsx: true,
  indent: 2,
  quotes: 'single',
  semi: false,
  overrides: {
    'style/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    'style/brace-style': 'off',
    'style/arrow-parens': ['error', 'as-needed'],
    'curly': ['error', 'multi-line'],
    'antfu/if-newline': 'off',
    'antfu/curly': 'off',
  },
}

export const defaultFormatterConfig: AntFuFormatterConfig = {
  css: 'prettier',
  html: 'prettier',
  markdown: 'prettier',
  prettierOptions: {
    printWidth: 160,
    tabWidth: 2,
    arrowParens: 'avoid',
    vueIndentScriptAndStyle: true,
    useTabs: false,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
  },
}
