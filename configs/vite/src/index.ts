import type {BuildOptions, Plugin, PluginOption, UserConfig} from 'vite'

// 导入性能优化相关类型
import type {FullPerformanceOptions, PerformancePreset} from './performance/presets'
import type {BuildLibraryConfigOptions} from './types'
import type {SimpleDtsOptions} from './vite-plugin-dts'
import type {PackageJsonOptions} from './vite-plugin-package-json'
import {mergeConfig} from 'vite'
import {Externals as defaultExternals} from './externals'
import {BuildConfigLib} from './lib'

import {createPerformancePreset} from './performance/presets'
import {createDtsPlugin} from './vite-plugin-dts'

// 导出性能优化相关功能
export type {VitePerformanceOptions} from './performance'
export {createChunkOptimization, createDepsOptimization, createDevelopmentPerformanceConfig, createEsbuildOptimization, createProductionPerformanceConfig, createVitePerformanceConfig} from './performance'
export type {CacheOptimizationOptions} from './performance/cache'
export {createBuildCacheOptimization, createCacheOptimization, createTypeScriptCacheOptimization} from './performance/cache'

export type {DevelopmentOptimizationOptions} from './performance/development'

export {createDevBuildOptimization, createDevCssOptimization, createDevDepsOptimization, createDevelopmentOptimization, createDevEnvOptimization, createFastDevelopmentOptimization, createHMROptimization, createMonorepoDevelopmentOptimization, createSmartDevelopmentOptimization} from './performance/development'

export type {ParallelOptimizationOptions} from './performance/parallel'

export {createDevParallelOptimization, createMonorepoParallelOptimization, createParallelOptimization, createProdParallelOptimization, getOptimalConcurrency} from './performance/parallel'

export type {FullPerformanceOptions, PerformancePreset} from './performance/presets'
export {createAggressivePreset, createBasicPreset, createDevelopmentPreset, createFastDevPreset, createMaximumPreset, createMonorepoPreset, createPerformancePreset, createProductionPreset, createSmartPreset} from './performance/presets'

export interface ViteFragmentOptions {
  lib?: BuildLibraryConfigOptions
  dts?: boolean | Omit<SimpleDtsOptions, 'entry'>
  /**
   * @deprecated 不再自动处理 package.json
   * @see https://pnpm.io/catalogs
   */
  packageJson?: Omit<PackageJsonOptions, 'entry' | 'formats'>
  additionalExternals?: (string | RegExp)[]
  additionalPlugins?: PluginOption[]
  /** 性能优化配置 */
  performance?: {
    /** 性能优化预设 */
    preset?: PerformancePreset
    /** 自定义性能优化选项 */
    options?: FullPerformanceOptions
    /** 是否启用性能优化 */
    enabled?: boolean
  }
}

export function configureViteFragment(options: ViteFragmentOptions = {}, baseConfig: UserConfig = {}): UserConfig {
  const externals = [...defaultExternals, ...options.additionalExternals ?? []]

  const libDefaults: Partial<BuildLibraryConfigOptions> & {entry: string[]} = {
    entry: ['./src/index.ts'],
    entryRoot: 'src',
    outDir: 'dist',
    formats: ['es'] as const,
    sourcemap: false,
    name: 'index',
    fileNameMap: {es: '.js', cjs: '.cjs', umd: '.umd.js', iife: '.iife.js'},
    excludes: ['**/__tests__/**', '**/__test__/**', '**/__build-src__/**', '**/*.spec.ts', '**/*.test.ts'],
  }

  const userOrDefaultEntry = options.lib?.entry ?? libDefaults.entry
  const finalEntryArray = Array.isArray(userOrDefaultEntry) ? userOrDefaultEntry : [userOrDefaultEntry]

  const entryRoot = options.lib?.entryRoot ?? libDefaults.entryRoot ?? 'src'
  const resolvedEntryArray = finalEntryArray.map(entryPath => {
    if (entryPath.startsWith('./') || entryPath.startsWith('/') || entryRoot === '.') return entryPath
    const root = entryRoot.endsWith('/') ? entryRoot.slice(0, -1) : entryRoot
    const path = entryPath.startsWith('/') ? entryPath.slice(1) : entryPath
    return `${root}/${path}`
  })

  const mergedLibOptions: BuildLibraryConfigOptions = {
    ...libDefaults,
    ...options.lib,
    entry: resolvedEntryArray,
    entryRoot,
    externals: options?.lib?.externals ?? externals,
  }
  const generatedBuildOptions = BuildConfigLib(mergedLibOptions)

  let dtsPlugin: Plugin | undefined
  if (options.dts !== false && options.dts !== void 0) {
    const dtsDefaults: SimpleDtsOptions = {
      entry: finalEntryArray,
      entryRoot: mergedLibOptions.entryRoot,
      sourcemap: mergedLibOptions.sourcemap,
      outDir: mergedLibOptions.outDir ?? 'dist',
      excludes: mergedLibOptions.excludes,
    }

    const finalDtsOptions: SimpleDtsOptions = {...dtsDefaults, ...options.dts === true ? dtsDefaults : options.dts}
    dtsPlugin = createDtsPlugin({
      ...finalDtsOptions,
      outDir: finalDtsOptions.outDir ?? 'dist',
      sourcemap: finalDtsOptions.sourcemap ?? false,
      logLevel: 'error',
      strict: true,
    })
  }

  const mergedBuildOptions: BuildOptions = {...baseConfig.build, ...generatedBuildOptions}

  const generatedPlugins = [dtsPlugin].filter(Boolean)

  const basePluginsArray = (Array.isArray(baseConfig.plugins) ? baseConfig.plugins : [baseConfig.plugins ?? []]).flat()

  const basePluginsNormalized = basePluginsArray.filter(Boolean) as Plugin[]

  const mergedPlugins: PluginOption[] = [
    ...basePluginsNormalized,
    ...generatedPlugins,
    ...options.additionalPlugins ?? [],
  ]

  let finalConfig: UserConfig = {...baseConfig, build: mergedBuildOptions, plugins: mergedPlugins}

  // 应用性能优化配置
  if (options.performance?.enabled === false) return mergeConfig(finalConfig, baseConfig)

  const performanceConfig = createPerformancePreset(options.performance?.preset ?? 'basic', options.performance?.options ?? {})
  finalConfig = mergeConfig(finalConfig, performanceConfig)

  return finalConfig
}
