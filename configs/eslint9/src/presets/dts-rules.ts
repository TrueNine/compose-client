import type {Linter} from 'eslint'

/**
 * .d.ts 文件专用规则配置
 *
 * 针对 TypeScript 声明文件的特殊规则，放宽某些在声明文件中不适用的限制。
 *
 * @example
 * ```typescript
 * import {dtsRulesPreset} from '@truenine/eslint9-config/presets'
 *
 * export default [
 *   {
 *     files: ['**\/*.d.ts'],
 *     rules: dtsRulesPreset
 *   }
 * ]
 * ```
 */
export const dtsRulesPreset: Linter.RulesRecord = {'one-var': 'off'}
