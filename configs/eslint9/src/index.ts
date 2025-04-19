import type { OptionsTypeScriptParserOptions } from '@antfu/eslint-config'
import type { AntFuFormatterConfig, AntFuJsConfig, AntFuStrictTsConfig, AntFuStylisticConfig, AntFuTsConfig, AntFuUnocssConfig, AntFuVueConfig } from './types'
import { antfu } from '@antfu/eslint-config'
import { defaultFormatterConfig, defaultJsConfig, defaultStrictTsConfig, defaultStylisticConfig, defaultTsConfig, defaultUnocssConfig, defaultVueConfig, mergeWithDefaults } from './defaults'

interface ConfigOptions {
  type?: 'app' | 'lib'
  pnpm?: boolean
  test?: boolean
  ignores?: string[]
  jsx?: boolean
  vue?: boolean | AntFuVueConfig
  formatters?: boolean | AntFuFormatterConfig
  javascript?: AntFuJsConfig
  typescript?: boolean | AntFuStrictTsConfig | AntFuTsConfig
  unocss?: boolean | AntFuUnocssConfig
  stylistic?: boolean | AntFuStylisticConfig
}

export default async function eslint9(options: ConfigOptions = {}): Promise<ReturnType<typeof antfu>> {
  const {
    type = 'lib',
    ignores = [],
    test = false,
    unocss = false,
    vue = false,
    jsx = false,
    pnpm = true,
    stylistic = true,
    javascript = defaultJsConfig,
    typescript = defaultTsConfig,
    formatters = false,
  } = options

  const _unocss = mergeWithDefaults(unocss, defaultUnocssConfig)
  const _vue = mergeWithDefaults(vue, defaultVueConfig)
  const _javascript = mergeWithDefaults(javascript, defaultJsConfig)
  const _stylistic = mergeWithDefaults(stylistic, defaultStylisticConfig)
  const _formatters = mergeWithDefaults(formatters, defaultFormatterConfig)
  let _typescript = typescript

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
    pnpm,
    test,
    unocss: _unocss,
    vue: _vue,
    jsx,
    typescript: _typescript,
    javascript: _javascript,
    stylistic: _stylistic,
    formatters: _formatters,
  })
}
