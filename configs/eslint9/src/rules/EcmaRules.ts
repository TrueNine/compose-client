import type {Rules} from 'eslint-define-config'

export const EcmaRules = {
  'no-undefined': 'error',
  'no-restricted-syntax': 'error',
  'no-global-assign': 'error',
  'no-unused-vars': 'off',
  'no-var': 'error',
  camelcase: ['error', {properties: 'always'}], // 优先使用 const
  'prefer-const': [
    'error',
    {
      destructuring: 'any',
      ignoreReadBeforeAssign: false
    }
  ]
} as Partial<Rules>
