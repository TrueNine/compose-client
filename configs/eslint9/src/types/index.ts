import type antfu from '@antfu/eslint-config'

/**
 * AntFu Config
 */
export type AntFuConfig = NonNullable<Parameters<typeof antfu>[0]>

/**
 * typescript config options
 */
export type AntFuTsConfig = Exclude<AntFuConfig['typescript'], boolean | undefined>

/**
 * javascript config options
 */
export type AntFuJsConfig = Exclude<AntFuConfig['javascript'], boolean | undefined>

/**
 * vue config options
 */
export type AntFuVueConfig = Exclude<AntFuConfig['vue'], boolean | undefined>

/**
 * unocss config options
 */
export type AntFuUnocssConfig = Exclude<AntFuConfig['unocss'], boolean | undefined>

/**
 * stylistic config options
 */
export type AntFuStylisticConfig = Exclude<AntFuConfig['stylistic'], boolean | undefined>

/**
 * formatter config options
 */
export type AntFuFormatterConfig = Exclude<AntFuConfig['formatters'], boolean | undefined>

/**
 * 严格的 typescript config
 */
export type AntFuStrictTsConfig = AntFuTsConfig & {
  strictTypescriptEslint: true
  tsconfigPath: string
  parserOptions: {
    project: string[]
    tsconfigRootDir: string
    sourceType: 'module'
  }
}
