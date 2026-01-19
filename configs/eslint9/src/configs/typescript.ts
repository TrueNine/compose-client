import type {AntFuTsConfig} from '../types'

/** TypeScript 默认配置 */
export const typescriptConfig: AntFuTsConfig = {overrides: {
  'ts/no-unsafe-assignment': 'off',
  'ts/no-unsafe-call': 'off',
  'ts/no-unsafe-argument': 'off',
  'ts/no-unsafe-return': 'off',
  'ts/member-ordering': ['error'],
  'ts/no-extra-non-null-assertion': 'error',
  'ts/no-non-null-assertion': 'error',
  'ts/no-explicit-any': ['error', {fixToUnknown: true, ignoreRestArgs: true}],
  'ts/no-namespace': 'error',
  'ts/no-unused-vars': [
    'error',
    {vars: 'all', args: 'after-used', ignoreRestSiblings: false}
  ]
}}

/** @deprecated 使用 typescriptConfig 代替 */
export const defaultTsConfig: AntFuTsConfig = typescriptConfig

/**
 * 严格 TypeScript 模式的默认配置
 *
 * 需要配置 parserOptions 和 tsconfigPath
 * @see https://typescript-eslint.io/getting-started/typed-linting
 */
export const strictTypescriptConfig: AntFuTsConfig = {overrides: {
  'ts/no-unsafe-assignment': 'off',
  'ts/no-unsafe-call': 'off',
  'ts/no-unsafe-argument': 'off',
  'ts/no-unsafe-return': 'off',
  'ts/no-floating-promises': 'error'
}}

/** @deprecated 使用 strictTypescriptConfig 代替 */
export const defaultStrictTsConfig: AntFuTsConfig = strictTypescriptConfig
