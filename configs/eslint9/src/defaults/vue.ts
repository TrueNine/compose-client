import type {AntFuVueConfig} from '../types'

export const defaultVueConfig: AntFuVueConfig = {
  vueVersion: 3,
  overrides: {
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'always',
        component: 'always',
      },
    }],
    'vue/html-comment-content-spacing': ['error', 'always', {exceptions: []}],
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
        order: ['defineProps', 'defineEmits', 'defineModel', 'defineSlots'],
        defineExposeLast: true,
      },
    ],
    'vue/block-order': [
      'error',
      {order: ['script', 'template', 'style']},
    ],
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
          'CONTENT',
        ],
      },
    ],
    'vue/v-on-event-hyphenation': ['error', 'never', {autofix: true}],
    'vue/attribute-hyphenation': ['error', 'never', {ignoreTags: ['i-', 'v-', 'v-bind']}],
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
}
