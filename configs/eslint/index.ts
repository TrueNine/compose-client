import '@rushstack/eslint-patch/modern-module-resolution' // @ts-ignore
import typescriptEslintParser from '@typescript-eslint/parser'
import {defineConfig} from 'eslint-define-config'

export default defineConfig({
  plugins: ['import', '@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    // @ts-ignore
    parser: {
      js: 'espree',
      jsx: 'espree',
      cjs: 'espree',
      mjs: 'espree',
      ts: typescriptEslintParser,
      tsx: typescriptEslintParser,
      cts: typescriptEslintParser,
      mts: typescriptEslintParser
    },
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['*.ts', '*.cts', '*.mts', '*.tsx', '*.vue'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  env: {
    browser: true,
    es2023: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  rules: {
    'no-empty': 'off', //不允许空代码块
    'prettier/prettier': 'off',
    // import排序
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always'
      }
    ],
    'no-await-in-loop': 'off', // 禁止在循环中出现 await
    //禁止变量声明与外层作用域的变量同名
    // "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": [], "ignoreOnInitialization": false }],
    // vue 属性排序
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ]
      }
    ],
    'no-var': 'error',
    semi: 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-explicit-any': 'error', // TODO 不可以使用 any 类型
    '@typescript-eslint/no-empty-function': 'off', // 不允许空函数
    '@typescript-eslint/no-namespace': 'off', //禁止使用命名空间
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
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': ['off'],
    'vue/no-setup-props-reactivity-loss': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: ['router-view', 'router-link', 'scroll-view'],
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
