import type { AntFuJsConfig } from '../types'

export const defaultJsConfig: AntFuJsConfig = {
  overrides: {
    'no-inline-comments': 'error',
    'unicorn/no-useless-spread': 'error',
    'curly': ['error', 'multi-line'],
    'no-undefined': 'off',
    'no-cond-assign': ['error', 'always'],
    'no-constant-condition': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Identifier[name="undefined"]',
        message: 'Use `void 0` instead of `undefined`.',
      },
    ],
    'no-global-assign': 'error',
    'no-unused-vars': 'error',
    'no-var': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
  },
}
