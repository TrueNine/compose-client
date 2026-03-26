import type {OptionsTypeScriptParserOptions} from '@antfu/eslint-config'
import type {Linter} from 'eslint'
import type {AntFuMarkdownConfig, AntFuStrictTsConfig, AntFuTsConfig, AntFuVueConfig, ConfigOptions, ConfigProfile} from './types'
import {antfu} from '@antfu/eslint-config'
import {applyUniappVueConfig, formatterConfig, javascriptConfig, markdownConfig, strictTypescriptConfig, stylisticConfig, testConfig, typescriptConfig, unocssConfig, vueConfig} from './configs'
import {plugin} from './plugin'
import {aiRulesPreset, compactRulesPreset, dtsRulesPreset, typescriptRulesPreset} from './presets'
import {mergeWithDefaults} from './utils'

const defaultIgnores = [
  '**/.turbo/**',
  '**/coverage/**',
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

const docsFiles = ['**/*.md', '**/*.md/**']
const sourceFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs', '**/*.vue']
const testAndExampleFiles = ['**/*.spec.*', '**/*.test.*', '**/__tests__/**', '**/playground/**']
const typeDefinitionFiles = ['**/*.d.ts']

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
export async function defineConfig(options: ConfigOptions = {}): Promise<Awaited<ReturnType<typeof antfu>>> {
  const {
    profile = 'ai',
    type = 'lib',
    ignores = [],
    markdown = markdownConfig,
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
  const _markdown = mergeMarkdownConfig(markdown, markdownConfig)
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

  const _typescript = resolveTypescriptConfig(typescript)
  const _pnpm = type === 'app' ? false : pnpm

  if (isStrictTsConfig(_typescript)) {
    if (typeof _typescript === 'object' && 'tsconfigPath' in _typescript) {
      const opts = _typescript as OptionsTypeScriptParserOptions
      if (opts.parserOptions?.projectService === void 0) {
        opts.parserOptions = {
          ...opts.parserOptions,
          projectService: true
        }
      }
    }
  }

  return antfu(
    {
      ...restOptions,
      markdown: _markdown,
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
    {
      name: `@truenine/${profile}-source-rules`,
      files: sourceFiles,
      ignores: [...docsFiles, ...testAndExampleFiles, ...typeDefinitionFiles],
      plugins: {'@truenine': plugin},
      rules: resolveProfileRules(profile)
    } as Linter.Config,
    {name: '@truenine/dts-rules', files: ['**/*.d.ts'], rules: dtsRulesPreset} as Linter.Config,
    {name: '@truenine/typescript-rules', files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'], ignores: ['**/*.md/**'], rules: typescriptRulesPreset} as Linter.Config
  )
}

function mergeMarkdownConfig(
  value: boolean | AntFuMarkdownConfig | null | undefined,
  defaults: AntFuMarkdownConfig
): boolean | AntFuMarkdownConfig {
  if (value === false || value === null) return false
  if (value === true || value === void 0) return defaults

  return {
    ...defaults,
    ...value,
    overrides: {
      ...defaults.overrides,
      ...value.overrides
    },
    overridesMarkdown: {
      ...defaults.overridesMarkdown,
      ...value.overridesMarkdown
    }
  }
}

function isStrictTsConfig(config: unknown): config is AntFuStrictTsConfig {
  return config !== null && typeof config === 'object' && 'strictTypescriptEslint' in config && (config as AntFuStrictTsConfig).strictTypescriptEslint
}

function resolveProfileRules(profile: ConfigProfile): Linter.RulesRecord {
  return profile === 'compact' ? compactRulesPreset : aiRulesPreset
}

type TsConfigWithInternals = AntFuTsConfig & {
  overrides?: Linter.RulesRecord
  parserOptions?: OptionsTypeScriptParserOptions['parserOptions']
}

function resolveTypescriptConfig(
  value: boolean | AntFuStrictTsConfig | AntFuTsConfig | null | undefined
): boolean | AntFuTsConfig {
  if (value === false || value === null) return false
  if (value === true || value === void 0) return typescriptConfig

  if (!isStrictTsConfig(value)) return mergeTypescriptConfigs(typescriptConfig, value)

  return mergeTypescriptConfigs(typescriptConfig, strictTypescriptConfig, value)
}

function mergeTypescriptConfigs(...configs: AntFuTsConfig[]): AntFuTsConfig {
  return configs.reduce<TsConfigWithInternals>((acc, config) => {
    const current = acc
    const next = config as TsConfigWithInternals

    return {
      ...current,
      ...next,
      parserOptions: {
        ...current.parserOptions,
        ...next.parserOptions
      },
      overrides: {
        ...current.overrides,
        ...next.overrides
      }
    }
  }, {})
}

export default defineConfig
