import type {Linter} from 'eslint'

/**
 * TypeScript 专用规则配置
 * 包含 @typescript-eslint 插件的规则，用于增强 TypeScript 代码质量。
 * 这些规则需要类型信息，因此需要配置 parserOptions.project。
 */
export const typescriptRulesPreset: Linter.RulesRecord = {
  '@typescript-eslint/prefer-optional-chain': 'error', /* 优先使用可选链和空值合并 */
  '@typescript-eslint/prefer-nullish-coalescing': 'error',

  '@typescript-eslint/prefer-includes': 'error', /* 优先使用现代方法 */
  '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/prefer-regexp-exec': 'error',

  '@typescript-eslint/promise-function-async': 'error', /* 异步函数规则 */

  '@typescript-eslint/unbound-method': 'off', /* 关闭的规则 */
  '@typescript-eslint/switch-exhaustiveness-check': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'off',

  '@typescript-eslint/array-type': ['error', {default: 'array'}], /* 类型相关规则 */
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-unnecessary-type-constraint': 'error',
  '@typescript-eslint/no-unnecessary-type-arguments': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-namespace': 'error',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-as-const': 'error',
}
