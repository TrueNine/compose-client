import type {Linter} from 'eslint'

const sharedRulesPreset: Linter.RulesRecord = {
  'antfu/curly': 'off',
  'antfu/if-newline': 'off',
  'arrow-body-style': ['error', 'as-needed'],
  'curly': ['error', 'multi-line'],
  'no-else-return': ['error', {allowElseIf: false}],
  'no-extra-boolean-cast': 'error',
  'no-extra-parens': ['error', 'all', {nestedBinaryExpressions: false, ignoreJSX: 'multi-line', enforceForArrowConditionals: false}],
  'no-useless-call': 'error',
  'no-useless-catch': 'error',
  'no-useless-computed-key': 'error',
  'no-useless-concat': 'error',
  'no-useless-constructor': 'error',
  'no-useless-escape': 'error',
  'no-useless-rename': 'error',
  'no-useless-return': 'error',
  'object-shorthand': ['error', 'always'],
  'one-var': ['error', {initialized: 'never', uninitialized: 'consecutive'}],
  'prefer-destructuring': ['error', {array: false, object: true}, {enforceForRenamedProperties: false}],
  'prefer-exponentiation-operator': 'error',
  'prefer-object-has-own': 'error',
  'prefer-template': 'error',
  'unicorn/no-instanceof-array': 'error',
  'unicorn/prefer-array-flat': 'error',
  'unicorn/prefer-array-flat-map': 'error',
  'unicorn/prefer-array-find': 'error',
  'unicorn/prefer-array-index-of': 'error',
  'unicorn/prefer-array-some': 'error',
  'unicorn/prefer-at': 'error',
  'unicorn/prefer-code-point': 'error',
  'unicorn/prefer-date-now': 'error',
  'unicorn/prefer-default-parameters': 'error',
  'unicorn/prefer-dom-node-append': 'error',
  'unicorn/prefer-dom-node-remove': 'error',
  'unicorn/prefer-dom-node-text-content': 'error',
  'unicorn/prefer-event-target': 'error',
  'unicorn/prefer-export-from': 'warn',
  'unicorn/prefer-includes': 'error',
  'unicorn/prefer-logical-operator-over-ternary': 'error',
  'unicorn/prefer-math-trunc': 'error',
  'unicorn/prefer-modern-math-apis': 'error',
  'unicorn/prefer-modern-dom-apis': 'error',
  'unicorn/prefer-negative-index': 'error',
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/prefer-number-properties': 'error',
  'unicorn/prefer-object-from-entries': 'error',
  'unicorn/prefer-query-selector': 'error',
  'unicorn/prefer-reflect-apply': 'error',
  'unicorn/prefer-regexp-test': 'error',
  'unicorn/prefer-set-size': 'error',
  'unicorn/prefer-spread': 'error',
  'unicorn/prefer-string-replace-all': 'error',
  'unicorn/prefer-string-slice': 'error',
  'unicorn/prefer-string-starts-ends-with': 'error',
  'unicorn/prefer-string-trim-start-end': 'error',
  'unicorn/prefer-structured-clone': 'error',
  'unicorn/prefer-ternary': 'error',
  'unicorn/prefer-type-error': 'error',
  'unicorn/text-encoding-identifier-case': 'error'
}

export const aiRulesPreset: Linter.RulesRecord = {
  ...sharedRulesPreset,
  '@truenine/no-task-comment': 'error',
  '@truenine/prefer-guard-clause': ['warn', {minStatements: 2}],
  '@truenine/prefer-lookup-table': 'warn'
}

export const compactRulesPreset: Linter.RulesRecord = {
  ...aiRulesPreset,
  '@truenine/prefer-concise-arrow': 'warn',
  '@truenine/prefer-single-line-call': 'warn',
  '@truenine/prefer-single-line-control': 'warn',
  '@truenine/prefer-single-line-if': 'warn',
  '@truenine/prefer-void-zero': 'warn'
}

/** @deprecated 使用 aiRulesPreset 代替 */
export const baseRulesPreset: Linter.RulesRecord = aiRulesPreset
