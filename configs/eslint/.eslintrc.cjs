// 需要安装依赖:  npm i eslint-define-config
const {defineConfig} = require('eslint-define-config')
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = defineConfig({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-var': 'error',
    semi: 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-explicit-any': 'error', // TODO 不可以使用 any 类型
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Foo: "Don't use Foo because it is unsafe",
          String: {
            message: 'Use string instead',
            fixWith: 'string'
          },
          '{}': {
            message: 'Use object instead',
            fixWith: 'object'
          }
        }
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false
      }
    ],
    'vue/html-indent': 'off', // 关闭此规则 使用 prettier 的格式化规则，
    'vue/max-attributes-per-line': ['off'],
    'vue/no-setup-props-destructure': 'off', // 优先使用驼峰
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: [],
        registeredComponentsOnly: false
      }
    ],
    camelcase: ['error', {properties: 'always'}], // 优先使用 const
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }
    ]
  }
})
