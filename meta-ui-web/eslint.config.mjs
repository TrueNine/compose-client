import { antfu } from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  ignores: [
    '!__generated/**',
  ],
  unocss: true,
  jsx: true,
  test: {},
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
  formatters: {
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
  },
  vue: {
    overrides: {
      'vue/html-comment-content-spacing': ['error', 'always', { exceptions: [] }],
      'vue/html-comment-indent': ['error', 2],
      'vue/html-indent': ['error', 2, {
        baseIndent: 0,
        alignAttributesVertically: true,
      }],
      'vue/define-emits-declaration': ['error', 'type-literal'],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits', 'defineSlots'],
          defineExposeLast: true,
        },
      ],
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/attributes-order': [
        'error',
        {
          order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'],
        },
      ],
      'vue/v-on-event-hyphenation': [
        'error',
        'never',
        {
          autofix: true,
        },
      ],
      'vue/attribute-hyphenation': [
        'error',
        'never',
        {
          ignoreTags: ['i-', 'v-', 'v-bind'],
        },
      ],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          ignores: ['router-view', 'router-link', 'scroll-view'],
          registeredComponentsOnly: false,
        },
      ],
    },
  },
  javascript: {
    overrides: {
      'curly': ['error', 'all'],
      // 'no-undefined': 'error',
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
    overrides: {
      'ts/no-extra-non-null-assertion': 'error',
      'ts/no-non-null-assertion': 'error',
      // 'ts/no-unnecessary-condition': ['error', { allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true, allowConstantLoopConditions: false, checkTypePredicates: true }],
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
    },
  },
})
