import {configureVueProject} from '@vue/eslint-config-typescript'
import {antfu, type Awaitable, type TypedFlatConfigItem} from '@antfu/eslint-config'

configureVueProject({
  scriptLangs: ['ts', 'tsx', 'js', 'jsx']
})

type UserEslintConfig = Awaitable<TypedFlatConfigItem> | TypedFlatConfigItem

export const EcmaRules: UserEslintConfig = {
  rules: {
    'no-undefined': 'error',
    'no-restricted-syntax': 'error',
    'no-global-assign': 'error',
    'no-unused-vars': 'error',
    'no-var': 'error',
    camelcase: ['error', {properties: 'always'}], // 优先使用 const
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }
    ]
  }
}

export const TypescriptRules: UserEslintConfig = {
  rules: {
    'ts/no-explicit-any': 'error',
    'ts/no-namespace': 'off',
    'ts/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false
      }
    ]
  }
}
export const VueRules: UserEslintConfig = {
  rules: {
    'vue/attributes-order': [
      'warn',
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
    'vue/v-on-event-hyphenation': [
      'error',
      'never',
      {
        autofix: true
      }
    ],
    'vue/attribute-hyphenation': [
      'error',
      'never',
      {
        ignoreTags: ['i-', 'v-', 'v-bind']
      }
    ],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: ['router-view', 'router-link', 'scroll-view'],
        registeredComponentsOnly: false
      }
    ]
  }
}

type PrettierC = NonNullable<Parameters<typeof antfu>[0]>['formatters']
export const Formatters: PrettierC = {
  css: 'prettier',
  html: 'prettier',
  prettierOptions: {
    tabWidth: 2,
    arrowParens: 'avoid',
    vueIndentScriptAndStyle: true,
    useTabs: false,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
  },
}
