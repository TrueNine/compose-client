import type {AntFuMarkdownConfig, AntFuTestConfig, AntFuUnocssConfig} from '../types'

/** UnoCSS 默认配置 */
export const unocssConfig: AntFuUnocssConfig = {attributify: true, strict: true}

/** @deprecated 使用 unocssConfig 代替 */
export const defaultUnocssConfig: AntFuUnocssConfig = unocssConfig

const docsSafeRules = {
  '@truenine/beside-comment': 'off',
  '@truenine/no-document-requirements': 'off',
  '@truenine/no-separator-comment': 'off',
  '@truenine/no-task-comment': 'off',
  '@truenine/prefer-concise-arrow': 'off',
  '@truenine/prefer-separate-try-catch': 'off',
  '@truenine/prefer-single-line-call': 'off',
  '@truenine/prefer-single-line-control': 'off',
  '@truenine/prefer-single-line-if': 'off',
  '@truenine/prefer-void-zero': 'off',
  'antfu/consistent-list-newline': 'off',
  'style/array-bracket-spacing': 'off',
  'style/arrow-spacing': 'off',
  'style/comma-dangle': 'off',
  'style/comma-spacing': 'off',
  'style/computed-property-spacing': 'off',
  'style/eol-last': 'off',
  'style/function-call-argument-newline': 'off',
  'style/function-paren-newline': 'off',
  'style/key-spacing': 'off',
  'style/keyword-spacing': 'off',
  'style/max-statements-per-line': 'off',
  'style/object-curly-newline': 'off',
  'style/object-curly-spacing': 'off',
  'style/semi-spacing': 'off',
  'style/space-before-blocks': 'off',
  'style/space-before-function-paren': 'off',
  'style/space-in-parens': 'off',
  'style/space-infix-ops': 'off',
  'style/space-unary-ops': 'off',
  'style/spaced-comment': 'off',
  'style/template-curly-spacing': 'off',
  'style/type-annotation-spacing': 'off',
  'ts/no-explicit-any': 'off',
  'ts/no-floating-promises': 'off',
  'ts/no-non-null-assertion': 'off',
  'ts/no-unused-vars': 'off',
  'ts/no-unnecessary-type-assertion': 'off'
} as const

/** Markdown 默认配置 */
export const markdownConfig: AntFuMarkdownConfig = {
  overrides: docsSafeRules,
  overridesMarkdown: docsSafeRules
}

/** @deprecated 使用 markdownConfig 代替 */
export const defaultMarkdownConfig: AntFuMarkdownConfig = markdownConfig

/** Test 默认配置 */
export const testConfig: AntFuTestConfig = {overrides: {
  'no-console': 'off',
  'ts/unbound-method': 'off',
  'ts/no-unsafe-argument': 'off',
  'ts/no-unsafe-assignment': 'off',
  'ts/no-unsafe-member-access': 'off',
  'ts/no-unsafe-call': 'off',
  'ts/no-unsafe-return': 'off'
}}

/** @deprecated 使用 testConfig 代替 */
export const defaultTestConfig: AntFuTestConfig = testConfig
