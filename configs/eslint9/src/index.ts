import type {OptionsTypeScriptParserOptions} from '@antfu/eslint-config'
import type {Linter} from 'eslint'
import type {AntFuConfig, AntFuStrictTsConfig, AntFuTsConfig} from './types'
import {antfu} from '@antfu/eslint-config'
import {baseRules, defaultFormatterConfig, defaultJsConfig, defaultStrictTsConfig, defaultStylisticConfig, defaultTestConfig, defaultTsConfig, defaultUnocssConfig, defaultVueConfig, dtsRules, typescriptRules} from './defaults'
import {plugin} from './plugin'
import {mergeWithDefaults} from './utils'

export {plugin} from './plugin'

/**
 * Extends AntFuConfig to allow users to pass any options supported by antfu()
 * while providing sensible defaults for common options
 */
export interface ConfigOptions extends Omit<AntFuConfig, 'typescript'> {
  /**
   * TypeScript config, supports strict mode with `strictTypescriptEslint: true`
   */
  typescript?: boolean | AntFuStrictTsConfig | AntFuTsConfig
}

export async function applyPreset(options: ConfigOptions = {}): Promise<ReturnType<typeof antfu>> {
  return eslint9(options)
}

export default async function eslint9(options: ConfigOptions = {}): Promise<ReturnType<typeof antfu>> {
  const {
    type = 'lib', ignores = [], test = true, nextjs = false, react = false, unocss = false, vue = false, jsx = false, pnpm = false, stylistic = true, javascript = defaultJsConfig, typescript = defaultTsConfig, formatters = false, ...restOptions
  } = options

  const _test = mergeWithDefaults(test, defaultTestConfig)
  const _unocss = mergeWithDefaults(unocss, defaultUnocssConfig)
  const _vue = mergeWithDefaults(vue, defaultVueConfig)
  const _javascript = mergeWithDefaults(javascript, defaultJsConfig)
  const _stylistic = mergeWithDefaults(stylistic, defaultStylisticConfig)
  const _formatters = mergeWithDefaults(formatters, defaultFormatterConfig)

  let _typescript = typescript
  const _pnpm = type === 'app' ? false : pnpm

  if (isStrictTsConfig(_typescript)) {
    const merged = mergeWithDefaults(_typescript as AntFuTsConfig, defaultStrictTsConfig)
    if (typeof merged === 'object' && 'tsconfigPath' in merged) (merged as OptionsTypeScriptParserOptions).parserOptions = {projectService: true}
    _typescript = merged
  }

  return antfu(
    {
      ...restOptions, markdown: true, type, ignores, pnpm: _pnpm, test: _test, unocss: _unocss, vue: _vue, nextjs, react, jsx, typescript: _typescript, javascript: _javascript, stylistic: _stylistic, formatters: _formatters,
    },
    {name: '@truenine/eslint-plugin', plugins: {'@truenine': plugin}, rules: baseRules} as Linter.Config,
    {name: '@truenine/dts-rules', files: ['**/*.d.ts'], rules: dtsRules} as Linter.Config,
    {name: '@truenine/typescript-rules', files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'], rules: typescriptRules} as Linter.Config,
  )
}

function isStrictTsConfig(config: unknown): config is AntFuStrictTsConfig {
  return config !== null && typeof config === 'object' && 'strictTypescriptEslint' in config && (config as AntFuStrictTsConfig).strictTypescriptEslint
}

export * from './rules'
