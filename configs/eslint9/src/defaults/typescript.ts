import type {AntFuTsConfig} from '../types'

export const defaultTsConfig: AntFuTsConfig = {overrides: {
  'ts/no-unsafe-assignment': 'off',
  'ts/no-unsafe-call': 'off',
  'ts/no-unsafe-argument': 'off',
  'ts/no-unsafe-return': 'off',
  'ts/member-ordering': ['error'],
  'ts/no-extra-non-null-assertion': 'error',
  'ts/no-non-null-assertion': 'error',
  'ts/no-explicit-any': ['error', {fixToUnknown: true,
    ignoreRestArgs: true}],
  'ts/no-namespace': 'error',
  'ts/no-unused-vars': [
    'error',
    {vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false},
  ],
}}

/**
 * 严格 ts 模式的默认配置
 *
 * 需要配置 parserOptions 和 tsconfigPath
 * @see https://typescript-eslint.io/getting-started/typed-linting
 */
export const defaultStrictTsConfig: AntFuTsConfig = {overrides: {
  'ts/no-unsafe-assignment': 'off',
  'ts/no-unsafe-call': 'off',
  'ts/no-unsafe-argument': 'off',
  'ts/no-unsafe-return': 'off',
  'ts/no-floating-promises': 'error',
}}
