import type {OptionsTypeScriptParserOptions} from '@antfu/eslint-config'
import type {Linter} from 'eslint'
import type {AntFuStrictTsConfig, AntFuTsConfig, AntFuVueConfig, ConfigOptions} from './types'
import {antfu} from '@antfu/eslint-config'
import {applyUniappVueConfig, formatterConfig, javascriptConfig, strictTypescriptConfig, stylisticConfig, testConfig, typescriptConfig, unocssConfig, vueConfig} from './configs'
import {plugin} from './plugin'
import {baseRulesPreset, dtsRulesPreset, typescriptRulesPreset} from './presets'
import {mergeWithDefaults} from './utils'

const defaultIgnores = [
  '**/dist/**',
  '**/node_modules/**',

  '**/.agent/**',
  '**/.claude/**',
  '**/.factory/**',
  '**/.qoder/**',
  '**/.trae/**',
  '**/.kiro/**',
  'AGENTS.md',
  'README.md',
  'GEMINI.md',
  'CLAUDE.md',
  'WARP.md'
]

export {
  plugin
} from './plugin'
export * from './rules'
export type {
  ConfigOptions
} from './types'

/**
 * 创建 ESLint 配置
 *
 * @param options - 配置选项
 * @returns ESLint 配置数组
 */
export async function defineConfig(options: ConfigOptions = {}): ReturnType<typeof antfu> {
  const {
    type = 'lib',
    ignores = [],
    test = true,
    nextjs = false,
    react = false,
    unocss = false,
    vue = false,
    uniapp = false,
    jsx = false,
    pnpm = false,
    stylistic = true,
    javascript = javascriptConfig,
    typescript = typescriptConfig,
    formatters = false,
    ...restOptions
  } = options

  const resolvedIgnores = typeof ignores === 'function'
    ? (originals: string[]) => [...new Set([...defaultIgnores, ...ignores(originals)])]
    : [...new Set([...defaultIgnores, ...ignores])]
  const _test = mergeWithDefaults(test, testConfig)
  const _unocss = mergeWithDefaults(unocss, unocssConfig)
  let _vue = mergeWithDefaults(vue, vueConfig) as boolean | AntFuVueConfig
  const _javascript = mergeWithDefaults(javascript, javascriptConfig)
  const _stylistic = mergeWithDefaults(stylistic, stylisticConfig)
  const _formatters = mergeWithDefaults(formatters, formatterConfig)

  if (uniapp) {
    const resolvedVue = _vue === false || _vue === true ? vueConfig : _vue
    _vue = applyUniappVueConfig(resolvedVue)
  }

  let _typescript = typescript
  const _pnpm = type === 'app' ? false : pnpm

  if (isStrictTsConfig(_typescript)) {
    const merged = mergeWithDefaults(_typescript as AntFuTsConfig, strictTypescriptConfig)
    if (typeof merged === 'object' && 'tsconfigPath' in merged) {
      const opts = merged as OptionsTypeScriptParserOptions
      if (opts.parserOptions?.projectService === void 0) {
        opts.parserOptions = {
          ...opts.parserOptions,
          projectService: true
        }
      }
    }
    _typescript = merged
  }

  return antfu(
    {
      ...restOptions,
      markdown: true,
      type,
      ignores: resolvedIgnores,
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
      formatters: _formatters
    },
    {name: '@truenine/eslint-plugin', plugins: {'@truenine': plugin}, rules: baseRulesPreset} as Linter.Config,
    {name: '@truenine/dts-rules', files: ['**/*.d.ts'], rules: dtsRulesPreset} as Linter.Config,
    {name: '@truenine/typescript-rules', files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'], ignores: ['**/*.md/**'], rules: typescriptRulesPreset} as Linter.Config
  )
}

function isStrictTsConfig(config: unknown): config is AntFuStrictTsConfig {
  return config !== null && typeof config === 'object' && 'strictTypescriptEslint' in config && (config as AntFuStrictTsConfig).strictTypescriptEslint
}

export default defineConfig
