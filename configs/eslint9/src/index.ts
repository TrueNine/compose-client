import { antfu } from '@antfu/eslint-config'
import type { AntFuFormatterConfig, AntFuJsConfig, AntFuStrictTsConfig, AntFuStylisticConfig, AntFuTsConfig, AntFuUnocssConfig, AntFuVueConfig } from './types'
import { defaultFormatterConfig, defaultJsConfig, defaultStrictTsConfig, defaultStylisticConfig, defaultTsConfig, defaultUnocssConfig, defaultVueConfig, mergeWithDefaults } from './defaults'

interface ConfigOptions {
  type?: 'app' | 'lib'
  ignores?: string[]
  jsx?: boolean
  vue?: boolean | AntFuVueConfig
  formatters?: boolean | AntFuFormatterConfig
  javascript?: AntFuJsConfig
  typescript?: boolean | AntFuStrictTsConfig | AntFuTsConfig
  unocss?: boolean | AntFuUnocssConfig
  stylistic?: boolean | AntFuStylisticConfig
}


export default function eslint9(options: ConfigOptions = {}): ReturnType<typeof antfu> {
  let {
    type = 'app',
    ignores = [],
    unocss = false,
    vue = false,
    jsx = false,
    stylistic = false,
    javascript = defaultJsConfig,
    typescript = defaultTsConfig,
    formatters = false
  } = options

  unocss = mergeWithDefaults(unocss, defaultUnocssConfig)
  vue = mergeWithDefaults(vue, defaultVueConfig)
  javascript = mergeWithDefaults(javascript, defaultJsConfig)
  stylistic = mergeWithDefaults(stylistic, defaultStylisticConfig)
  formatters = mergeWithDefaults(formatters, defaultFormatterConfig)

  // 严格 ts 模式
  if (
    typescript !== null &&
    typeof typescript === 'object' &&
    'strictTypescriptEslint' in typescript &&
    typescript.strictTypescriptEslint === true
  ) {
    typescript = mergeWithDefaults(typescript, defaultStrictTsConfig)
  }

  return antfu({
    type,
    ignores,
    unocss,
    vue,
    jsx,
    typescript,
    javascript,
    stylistic,
    formatters
  })
}
