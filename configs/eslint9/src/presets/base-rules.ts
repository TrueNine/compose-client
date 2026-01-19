import type {Linter} from 'eslint'

/**
 * @truenine 插件基础规则配置
 *
 * 包含自定义规则和常用的代码风格规则，适用于所有 JavaScript/TypeScript 项目。
 * 这些规则旨在提高代码可读性和一致性。
 *
 * @example
 * ```typescript
 * import {baseRulesPreset} from '@truenine/eslint9-config/presets'
 *
 * export default [
 *   {
 *     rules: baseRulesPreset
 *   }
 * ]
 * ```
 */
export const baseRulesPreset: Linter.RulesRecord = {
  '@truenine/prefer-single-line-if': 'warn', /* @truenine 自定义规则 */
  '@truenine/prefer-single-line-control': 'warn',
  '@truenine/prefer-single-line-call': 'warn',
  '@truenine/prefer-concise-arrow': 'warn',
  '@truenine/prefer-guard-clause': ['warn', {minStatements: 2}],
  '@truenine/prefer-separate-try-catch': 'error',
  '@truenine/prefer-void-zero': 'warn', // '@truenine/compact-try-catch': 'off', /* 废弃 */
  '@truenine/prefer-lookup-table': 'warn',
  '@truenine/beside-comment': 'error',
  '@truenine/no-separator-comment': 'error',
  '@truenine/brace-style': ['error', '1tbs', {allowSingleLine: true}],
  'style/brace-style': 'off',

  'antfu/if-newline': 'off', /* antfu 规则覆盖 */
  'antfu/curly': 'off',

  'curly': ['error', 'multi-line'], /* 基础 JavaScript 规则 */
  'arrow-body-style': ['error', 'as-needed'],
  'prefer-destructuring': ['error', {array: false, object: true}, {enforceForRenamedProperties: false}],
  'prefer-template': 'error',
  'object-shorthand': ['error', 'always'],
  'prefer-exponentiation-operator': 'error',
  'prefer-object-has-own': 'error',
  'no-else-return': ['error', {allowElseIf: false}],
  'one-var': ['error', {initialized: 'never', uninitialized: 'consecutive'}],
  'no-extra-boolean-cast': 'error',
  'no-return-await': 'error',
  'no-useless-catch': 'error',
  'no-useless-return': 'error',
  'no-useless-constructor': 'error',
  'no-useless-rename': 'error',
  'no-useless-computed-key': 'error',
  'no-useless-concat': 'error',
  'no-useless-escape': 'error',
  'no-useless-call': 'error',
  'no-extra-parens': ['error', 'all', {nestedBinaryExpressions: false, ignoreJSX: 'multi-line', enforceForArrowConditionals: false}],

  'unicorn/prefer-includes': 'error', /* unicorn 规则 - 现代 JavaScript 最佳实践 */
  'unicorn/prefer-string-starts-ends-with': 'error',
  'unicorn/prefer-number-properties': 'error',
  'unicorn/no-instanceof-array': 'error',
  'unicorn/prefer-at': 'error',
  'unicorn/prefer-string-slice': 'error',
  'unicorn/prefer-spread': 'error',
  'unicorn/prefer-array-flat': 'error',
  'unicorn/prefer-array-flat-map': 'error',
  'unicorn/prefer-array-find': 'error',
  'unicorn/prefer-array-some': 'error',
  'unicorn/prefer-set-has': 'error',
  'unicorn/prefer-string-replace-all': 'error',
  'unicorn/prefer-string-trim-start-end': 'error',
  'unicorn/prefer-object-from-entries': 'error',
  'unicorn/prefer-default-parameters': 'error',
  'unicorn/prefer-negative-index': 'error',
  'unicorn/prefer-math-trunc': 'error',
  'unicorn/prefer-date-now': 'error',
  'unicorn/prefer-export-from': 'warn',
  'unicorn/prefer-ternary': 'error',
  'unicorn/prefer-logical-operator-over-ternary': 'error',
  'unicorn/prefer-regexp-test': 'error',
  'unicorn/prefer-modern-dom-apis': 'error',
  'unicorn/prefer-query-selector': 'error',
  'unicorn/prefer-dom-node-append': 'error',
  'unicorn/prefer-dom-node-remove': 'error',
  'unicorn/prefer-dom-node-text-content': 'error',
  'unicorn/prefer-event-target': 'error',
  'unicorn/prefer-type-error': 'error',
  'unicorn/prefer-code-point': 'error',
  'unicorn/prefer-modern-math-apis': 'error',
  'unicorn/prefer-structured-clone': 'error',
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/prefer-array-index-of': 'error',
  'unicorn/prefer-reflect-apply': 'error',
  'unicorn/prefer-set-size': 'error',
  'unicorn/text-encoding-identifier-case': 'error',
}
