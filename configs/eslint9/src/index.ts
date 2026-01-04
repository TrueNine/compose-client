import type { OptionsTypeScriptParserOptions } from '@antfu/eslint-config'
import type { AntFuFormatterConfig, AntFuJsConfig, AntFuStrictTsConfig, AntFuStylisticConfig, AntFuTestConfig, AntFuTsConfig, AntFuUnocssConfig, AntFuVueConfig } from './types/index'
import { antfu } from '@antfu/eslint-config'
import { defaultFormatterConfig, defaultJsConfig, defaultStrictTsConfig, defaultStylisticConfig, defaultTestConfig, defaultTsConfig, defaultUnocssConfig, defaultVueConfig, mergeWithDefaults } from './defaults/index'

export interface ConfigOptions {
  type?: 'app' | 'lib'
  pnpm?: boolean
  test?: boolean | AntFuTestConfig
  ignores?: string[]
  jsx?: boolean
  nextjs?: boolean
  react?: boolean
  vue?: boolean | AntFuVueConfig
  formatters?: boolean | AntFuFormatterConfig
  javascript?: AntFuJsConfig
  typescript?: boolean | AntFuStrictTsConfig | AntFuTsConfig
  unocss?: boolean | AntFuUnocssConfig
  stylistic?: boolean | AntFuStylisticConfig
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
  } = options

  const _test = mergeWithDefaults(test, defaultTestConfig)
  const _unocss = mergeWithDefaults(unocss, defaultUnocssConfig)
  const _vue = mergeWithDefaults(vue, defaultVueConfig)
  const _javascript = mergeWithDefaults(javascript, defaultJsConfig)
  const _stylistic = mergeWithDefaults(stylistic, defaultStylisticConfig)
  const _formatters = mergeWithDefaults(formatters, defaultFormatterConfig)
  let _typescript = typescript

  // 如果 type 为 'app'，强制 pnpm 为 false
  let _pnpm = pnpm
  if (type === 'app') {
    _pnpm = false
  }

  // 严格 ts 模式
  if (
    _typescript !== null
    && typeof _typescript === 'object'
    && 'strictTypescriptEslint' in _typescript
    && _typescript.strictTypescriptEslint === true
  ) {
    _typescript = mergeWithDefaults(typescript, defaultStrictTsConfig)
    if (typeof _typescript === 'object' && 'tsconfigPath' in _typescript) {
      (_typescript as OptionsTypeScriptParserOptions).parserOptions = {
        projectService: true,
      }
    }
  }

  return antfu({
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
  })
}
