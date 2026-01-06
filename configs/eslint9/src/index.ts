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

export { plugin } from './plugin'

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
      // 对象解构优先
      'prefer-destructuring': ['error', {
        array: false,
        object: true,
      }, { enforceForRenamedProperties: false }],
      // 使用模板字符串代替字符串拼接
      'prefer-template': 'error',
      // 对象字面量简写
      'object-shorthand': ['error', 'always'],
      // 使用 ** 代替 Math.pow
      'prefer-exponentiation-operator': 'error',
      // 使用 Object.hasOwn 代替 Object.prototype.hasOwnProperty.call
      'prefer-object-has-own': 'error',
      // 使用 includes 代替 indexOf !== -1
      'unicorn/prefer-includes': 'error',
      // 使用 startsWith/endsWith 代替正则
      'unicorn/prefer-string-starts-ends-with': 'error',
      // 使用 Number.isNaN 代替 isNaN
      'unicorn/prefer-number-properties': 'error',
      // 使用 Array.isArray 代替 instanceof Array
      'unicorn/no-instanceof-array': 'error',
      // 使用 .at() 代替 arr[arr.length - 1]
      'unicorn/prefer-at': 'error',
      // 使用 String#slice 代替 substring/substr
      'unicorn/prefer-string-slice': 'error',
      // 使用 spread 代替 Array.from
      'unicorn/prefer-spread': 'error',
      // 使用 Array#flat 代替 reduce + concat
      'unicorn/prefer-array-flat': 'error',
      // 使用 Array#flatMap 代替 map + flat
      'unicorn/prefer-array-flat-map': 'error',
      // 使用 Array#find 代替 filter[0]
      'unicorn/prefer-array-find': 'error',
      // 使用 Array#some 代替 find !== undefined
      'unicorn/prefer-array-some': 'error',
      // 使用 Set#has 代替 Array#includes（大数组性能更好）
      'unicorn/prefer-set-has': 'error',
      // 使用 String#replaceAll 代替全局正则替换
      'unicorn/prefer-string-replace-all': 'error',
      // 使用 String#trimStart/trimEnd 代替 trimLeft/trimRight
      'unicorn/prefer-string-trim-start-end': 'error',
      // 使用 Object.fromEntries 代替 reduce 构建对象
      'unicorn/prefer-object-from-entries': 'error',
      // 使用 default parameters 代替 || 默认值
      'unicorn/prefer-default-parameters': 'error',
      // 使用 negative index 代替 length - index
      'unicorn/prefer-negative-index': 'error',
      // 使用 Math.trunc 代替位运算截断
      'unicorn/prefer-math-trunc': 'error',
      // 使用 Date.now() 代替 new Date().getTime()
      'unicorn/prefer-date-now': 'error',
      // 使用 export from 代替 import + export
      'unicorn/prefer-export-from': 'error',
    },
  } as Linter.Config, {
    // TypeScript 专用规则（需要类型信息）
    name: '@truenine/typescript-rules',
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      // 优先使用 optional chaining (?.)
      '@typescript-eslint/prefer-optional-chain': 'error',
      // 优先使用 nullish coalescing (??) 代替 ||
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
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

export * from './rules'
