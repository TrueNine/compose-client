import type {AntFuTestConfig, AntFuUnocssConfig} from '../types'

/** UnoCSS 默认配置 */
export const unocssConfig: AntFuUnocssConfig = {attributify: true,
  strict: true}

/** @deprecated 使用 unocssConfig 代替 */
export const defaultUnocssConfig: AntFuUnocssConfig = unocssConfig

/** Test 默认配置 */
export const testConfig: AntFuTestConfig = {overrides: {
  'no-console': 'off',
  'ts/unbound-method': 'off',
  'ts/no-unsafe-argument': 'off',
  'ts/no-unsafe-assignment': 'off',
  'ts/no-unsafe-member-access': 'off',
  'ts/no-unsafe-call': 'off',
  'ts/no-unsafe-return': 'off',
}}

/** @deprecated 使用 testConfig 代替 */
export const defaultTestConfig: AntFuTestConfig = testConfig
