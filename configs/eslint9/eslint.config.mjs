import { antfu } from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  stylistic: {
    jsx: true,
    indent: 2,
    quotes: 'single',
    semi: false,
    overrides: {
      'style/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'style/brace-style': ['error', '1tbs'],
      'style/arrow-parens': ['error', 'always'],
    },
  },
  javascript: {
    overrides: {
      'no-inline-comments': 'error',
      'unicorn/no-useless-spread': 'error',
      'import/extensions': ['error', 'never', {
        'css': 'always',
        'svg': 'always',
        'vue': 'always',
        'json': 'always',
        'config.ts': 'always',
        'jpg': 'always',
        'png': 'always',
        'tsx': 'always',
        'jsx': 'always',
      }],
      'curly': ['error', 'all'],
      'no-undefined': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-constant-condition': 'error',
      'no-restricted-syntax': 'error',
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
  },
  typescript: {
    tsconfigPath: './tsconfig.node.json',
    parserOptions: {
      project: ['./tsconfig.json', './tsconfig.node.json'],
      tsconfigRootDir: '.',
      sourceType: 'module',
    },
    overrides: {
      'ts/member-ordering': ['error'],
      'ts/no-extra-non-null-assertion': 'error',
      'ts/no-non-null-assertion': 'error',
      'ts/no-explicit-any': 'error',
      'ts/no-namespace': 'off',
      'ts/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
        },
      ],
      'ts/no-floating-promises': 'error',
    },
  },
})
