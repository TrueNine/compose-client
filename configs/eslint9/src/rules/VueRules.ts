import type {Rules} from 'eslint-define-config'

/**
 * @see vue-eslint https://eslint.vuejs.org/
 */
export const VueRules = {
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
      ignore: ['i-', 'v-', 'v-bind']
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
} as Partial<Rules>
