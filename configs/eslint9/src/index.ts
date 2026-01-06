import type { OptionsTypeScriptParserOptions } from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { AntFuConfig, AntFuStrictTsConfig, AntFuTsConfig } from './types'
import { antfu } from '@antfu/eslint-config'
import {
  defaultFormatterConfig,
  defaultJsConfig,
  defaultStrictTsConfig,
  defaultStylisticConfig,
  defaultTestConfig,
  defaultTsConfig,
  defaultUnocssConfig,
  defaultVueConfig,
} from './defaults'
import { plugin } from './plugin'
import { mergeWithDefaults } from './utils'

export { plugin }
export * from './rules'

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
    type = 'lib',
    ignores = [],
    test = true,
    nextjs = false,
    react = false,
    unocss = false,
    vue = false,
    jsx = false,
    pnpm = false,
    stylistic = true,
    javascript = defaultJsConfig,
    typescript = defaultTsConfig,
    formatters = false,
    // Extract remaining options to pass through to antfu
    ...restOptions
  } = options

  const _test = mergeWithDefaults(test, defaultTestConfig)
  const _unocss = mergeWithDefaults(unocss, defaultUnocssConfig)
  const _vue = mergeWithDefaults(vue, defaultVueConfig)
  const _javascript = mergeWithDefaults(javascript, defaultJsConfig)
  const _stylistic = mergeWithDefaults(stylistic, defaultStylisticConfig)
  const _formatters = mergeWithDefaults(formatters, defaultFormatterConfig)

  let _typescript = typescript
  const _pnpm = type === 'app' ? false : pnpm

  // 严格 ts 模式
  if (isStrictTsConfig(_typescript)) {
    const merged = mergeWithDefaults(_typescript as AntFuTsConfig, defaultStrictTsConfig)
    if (typeof merged === 'object' && 'tsconfigPath' in merged) {
      (merged as OptionsTypeScriptParserOptions).parserOptions = {
        projectService: true,
      }
    }
    _typescript = merged
  }

  return antfu({
    // Pass through any additional options from user
    ...restOptions,
    // Apply our defaults (these override restOptions if duplicated)
    markdown: true,
    type,
    ignores,
    pnpm: _pnpm,
    test: _test,
    unocss: _unocss,
    vue: _vue,
    nextjs,
    react,
    jsx,
    typescript: _typescript,
    javascript: _javascript,
    stylistic: _stylistic,
    formatters: _formatters,
  }, {
    name: '@truenine/eslint-plugin',
    plugins: {
      '@truenine': plugin,
    },
    rules: {
      '@truenine/prefer-single-line-if': 'warn',
      '@truenine/prefer-guard-clause': ['warn', { minStatements: 2 }],
      'antfu/if-newline': 'off',
      'antfu/curly': 'off',
      'style/brace-style': 'off',
      'curly': ['error', 'multi-line'],
      // 箭头函数单行时去掉大括号
      'arrow-body-style': ['error', 'as-needed'],
    },
  } as Linter.Config)
}

function isStrictTsConfig(config: unknown): config is AntFuStrictTsConfig {
  return (
    config !== null
    && typeof config === 'object'
    && 'strictTypescriptEslint' in config
    && (config as AntFuStrictTsConfig).strictTypescriptEslint === true
  )
}
