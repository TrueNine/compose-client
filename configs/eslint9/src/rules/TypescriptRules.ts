import type {Rules} from 'eslint-define-config'

export const TypescriptRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false
    }
  ]
} as Partial<Rules>
