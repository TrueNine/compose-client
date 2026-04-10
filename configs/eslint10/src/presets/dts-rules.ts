import type {Linter} from 'eslint'

export const dtsRulesPreset: Linter.RulesRecord = {
  'one-var': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/no-empty-interface': 'warn',
  'no-restricted-syntax': [
    'error',
    {selector: 'FunctionDeclaration[body.body.length > 0]', message: '.d.ts files must not contain function implementations.'},
    {selector: 'MethodDefinition[value.body.body.length > 0]', message: '.d.ts files must not contain method implementations.'}
  ]
}
