import type { AntFuFormatterConfig, AntFuJsConfig, AntFuStylisticConfig, AntFuTsConfig, AntFuUnocssConfig, AntFuVueConfig } from '../types'

export const defaultUnocssConfig: AntFuUnocssConfig = {
  attributify: true,
  strict: true,
}

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
        order: [
          'defineProps',
          'defineEmits',
          'defineModel',
          'defineSlots',
        ],
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
}

export const defaultJsConfig: AntFuJsConfig = {
  overrides: {
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
}

export const defaultTsConfig: AntFuTsConfig = {
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
  },
}

export const defaultFormatterConfig: AntFuFormatterConfig = {
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
}

/**
 * 严格 ts 模式 的默认配置
 *
 * 这些配置需要 配置 parserOptions 和 tsconfigPath 等
 * @see https://typescript-eslint.io/getting-started/typed-linting
 */
export const defaultStrictTsConfig: AntFuTsConfig = {
  overrides: {
    'ts/no-floating-promises': 'error',
  },
}

export const defaultStylisticConfig: AntFuStylisticConfig = {
  jsx: true,
  indent: 2,
  quotes: 'single',
  semi: false,
  overrides: {
    'style/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    'style/brace-style': ['error', '1tbs'],
    'style/arrow-parens': ['error', 'always'],
  },
}

/**
 * 合并配置项，支持以下场景：
 * 1. 布尔值与对象配置的混合
 * 2. 使用 vite 的 mergeConfig 进行对象合并
 * 3. 处理 undefined 和 null 的默认值
 *
 * @example
 * ```ts
 * // 场景1: 布尔值转换为默认对象
 * mergeWithDefaults(true, { foo: 'bar' }) // => { foo: 'bar' }
 *
 * // 场景2: vite配置合并
 * mergeWithDefaults({ plugins: [vue()] }, { plugins: [unocss()] })
 *
 * // 场景3: undefined/null/false 处理
 * mergeWithDefaults(false, true) // => false
 * ```
 */
export function mergeWithDefaults<T extends object>(
  value?: boolean | T | null,
  defaults?: T
): T
export function mergeWithDefaults<T extends object>(
  value?: boolean | T | null,
  defaults?: boolean
): boolean | T
export function mergeWithDefaults<T extends object>(
  value?: boolean | T | null,
  defaults?: boolean | T | null,
): boolean | T {
  // 处理无默认值的情况
  if (defaults === false || defaults === null || defaults === void 0) {
    if (value === true) {
      return true
    }
    if (value === false || value === null) {
      return false
    }
    return value as T
  }

  // 处理 value 为 undefined 的情况
  if (value === void 0) {
    return defaults
  }

  // 处理 value 为 false/null 的情况
  if (value === false || value === null) {
    return false
  }

  // 处理 value 为 true 的情况
  if (value === true) {
    return defaults
  }

  // 如果都是对象，使用 vite 的 mergeConfig 进行合并
  if (typeof value === 'object' && typeof defaults === 'object') {
    return {
      ...defaults,
      ...value,
    }
  }

  // 其他情况返回 value
  return value
}
