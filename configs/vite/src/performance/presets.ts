import type {UserConfig} from 'vite'
import type {CacheOptimizationOptions} from './cache'
import type {VitePerformanceOptions} from './index'

import type {ParallelOptimizationOptions} from './parallel'
import process from 'node:process'
import {mergeConfig} from 'vite'
import {createCacheOptimization} from './cache'
import {createDevelopmentOptimization, createFastDevelopmentOptimization, createMonorepoDevelopmentOptimization} from './development'
import {createDevelopmentPerformanceConfig, createProductionPerformanceConfig, createVitePerformanceConfig} from './index'
import {createDevParallelOptimization, createMonorepoParallelOptimization, createParallelOptimization, createProdParallelOptimization} from './parallel'

/**
 * 性能优化预设类型
 */
export type PerformancePreset = 'basic' | 'aggressive' | 'maximum' | 'development' | 'fast-dev' | 'production' | 'monorepo'

/**
 * 完整的性能优化配置选项
 */
export interface FullPerformanceOptions extends VitePerformanceOptions {
  /** 缓存优化选项 */
  cache?: CacheOptimizationOptions
  /** 并行优化选项 */
  parallel?: ParallelOptimizationOptions
  /** 预设类型 */
  preset?: PerformancePreset
}

/**
 * 基础性能优化预设
 * 适用于大多数项目的基本优化
 */
export function createBasicPreset(options: FullPerformanceOptions = {}): UserConfig {
  const performanceConfig = createVitePerformanceConfig({
    enableEsbuildOptimization: true,
    enableChunkOptimization: false, // 基础预设不启用复杂的代码分割
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    ...options,
  })

  const cacheConfig = createCacheOptimization({enableFsCache: true, enableDepsCache: true, ...options.cache})

  return mergeConfig(performanceConfig, cacheConfig)
}

/**
 * 激进性能优化预设
 * 启用大部分优化功能，适用于对构建速度要求较高的项目
 */
export function createAggressivePreset(options: FullPerformanceOptions = {}): UserConfig {
  const performanceConfig = createVitePerformanceConfig({
    enableEsbuildOptimization: true,
    enableChunkOptimization: true,
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 800,
    reportCompressedSize: false,
    ...options,
  })

  const cacheConfig = createCacheOptimization({enableFsCache: true, enableDepsCache: true, ...options.cache})

  const parallelConfig = createParallelOptimization({enableWorkerThreads: true, enableParallelCss: true, enableParallelTypeCheck: true, ...options.parallel})

  return mergeConfig(mergeConfig(performanceConfig, cacheConfig), parallelConfig)
}

/**
 * 最大性能优化预设
 * 启用所有可用的优化功能，适用于大型项目或 CI/CD 环境
 */
export function createMaximumPreset(options: FullPerformanceOptions = {}): UserConfig {
  const performanceConfig = createVitePerformanceConfig({
    enableEsbuildOptimization: true,
    enableChunkOptimization: true,
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 600,
    reportCompressedSize: true,
    ...options,
  })

  const cacheConfig = createCacheOptimization({enableFsCache: true, enableDepsCache: true, forceClearCache: false, ...options.cache})

  const parallelConfig = createParallelOptimization({enableWorkerThreads: true, enableParallelCss: true, enableParallelTypeCheck: true, ...options.parallel})

  return mergeConfig(mergeConfig(performanceConfig, cacheConfig), parallelConfig)
}

/**
 * 开发环境优化预设
 * 专为开发环境优化，注重启动速度和热重载性能
 */
export function createDevelopmentPreset(options: FullPerformanceOptions = {}): UserConfig {
  const performanceConfig = createDevelopmentPerformanceConfig({
    enableEsbuildOptimization: true,
    enableChunkOptimization: false, // 开发环境不需要复杂的代码分割
    enableDepsOptimization: true,
    reportCompressedSize: false,
    ...options,
  })

  const cacheConfig = createCacheOptimization({enableFsCache: true, enableDepsCache: true, forceClearCache: false, ...options.cache})

  const parallelConfig = createDevParallelOptimization({enableWorkerThreads: true, enableParallelCss: false, // 开发环境可以关闭 CSS 并行处理以减少复杂度
    enableParallelTypeCheck: false, ...options.parallel}) // 开发环境通常由 IDE 处理类型检查

  const devOptimizationConfig = createDevelopmentOptimization({ // 使用新的开发模式优化
    enableFastRefresh: true,
    enableSmartHMR: true,
    enableDepsPreBundling: true,
    enableFsCache: true,
    port: 3000,
    open: false,
  })

  return mergeConfig(mergeConfig(mergeConfig(performanceConfig, cacheConfig), parallelConfig), devOptimizationConfig)
}

/**
 * 快速开发预设
 * 专为极速开发体验优化，最大化启动速度和热重载性能
 */
export function createFastDevPreset(options: FullPerformanceOptions = {}): UserConfig {
  const performanceConfig = createDevelopmentPerformanceConfig({
    enableEsbuildOptimization: true,
    enableChunkOptimization: false,
    enableDepsOptimization: true,
    reportCompressedSize: false,
    ...options,
  })

  const cacheConfig = createCacheOptimization({enableFsCache: true, enableDepsCache: true, forceClearCache: false, ...options.cache})

  const parallelConfig = createDevParallelOptimization({
    enableWorkerThreads: true,
    enableParallelCss: false,
    enableParallelTypeCheck: false,
    maxConcurrency: 2, // 减少并发以避免资源竞争
    ...options.parallel,
  })

  const fastDevConfig = createFastDevelopmentOptimization({ // 使用快速开发模式优化
    enableFastRefresh: true,
    enableSmartHMR: true,
    enableDepsPreBundling: true,
    enableFsCache: true,
    port: 3000,
    open: false,
  })

  return mergeConfig(mergeConfig(mergeConfig(performanceConfig, cacheConfig), parallelConfig), fastDevConfig)
}

/**
 * 生产环境优化预设
 * 专为生产环境优化，注重构建产物的质量和大小
 */
export function createProductionPreset(options: FullPerformanceOptions = {}): UserConfig {
  const performanceConfig = createProductionPerformanceConfig({
    enableEsbuildOptimization: true,
    enableChunkOptimization: true,
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    ...options,
  })

  const cacheConfig = createCacheOptimization({enableFsCache: true, enableDepsCache: true, ...options.cache})

  const parallelConfig = createProdParallelOptimization({enableWorkerThreads: true, enableParallelCss: true, enableParallelTypeCheck: true, ...options.parallel})

  return mergeConfig(mergeConfig(performanceConfig, cacheConfig), parallelConfig)
}

/**
 * Monorepo 优化预设
 * 专为 monorepo 项目优化，支持跨包构建和依赖管理
 */
export function createMonorepoPreset(options: FullPerformanceOptions = {}): UserConfig {
  const performanceConfig = createVitePerformanceConfig({
    enableEsbuildOptimization: true,
    enableChunkOptimization: true,
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 800,
    reportCompressedSize: false,
    ...options,
  })

  const cacheConfig = createCacheOptimization({enableFsCache: true, enableDepsCache: true, cacheDir: 'node_modules/.vite', ...options.cache}) // monorepo 使用统一的缓存目录

  const parallelConfig = createMonorepoParallelOptimization({enableWorkerThreads: true, enableParallelCss: true, enableParallelTypeCheck: true, ...options.parallel})

  const monorepoDevConfig = createMonorepoDevelopmentOptimization({enableFastRefresh: true, enableSmartHMR: true, enableDepsPreBundling: true, enableFsCache: true}) // 添加 Monorepo 开发模式优化

  return mergeConfig(mergeConfig(mergeConfig(performanceConfig, cacheConfig), parallelConfig), monorepoDevConfig)
}

/**
 * 根据预设类型创建性能优化配置
 */
export function createPerformancePreset(
  preset: PerformancePreset = 'basic',
  options: FullPerformanceOptions = {},
): UserConfig {
  switch (preset) {
    case 'basic': return createBasicPreset(options)
    case 'aggressive': return createAggressivePreset(options)
    case 'maximum': return createMaximumPreset(options)
    case 'development': return createDevelopmentPreset(options)
    case 'fast-dev': return createFastDevPreset(options)
    case 'production': return createProductionPreset(options)
    case 'monorepo': return createMonorepoPreset(options)
    default: return createBasicPreset(options)
  }
}

/**
 * 智能预设选择
 * 根据环境变量和项目特征自动选择合适的预设
 */
export function createSmartPreset(options: FullPerformanceOptions = {}): UserConfig {
  const isDev = process.env.NODE_ENV === 'development'
  const isProd = process.env.NODE_ENV === 'production'
  const isCI = process.env.CI === 'true'

  const isMonorepo = process.cwd().includes('packages') // 检测是否为 monorepo 项目
    || process.cwd().includes('apps')
    || (process.env.PNPM_WORKSPACE_ROOT != null)

  let preset: PerformancePreset = 'basic'

  if (isMonorepo) preset = 'monorepo'
  else if (isDev) preset = 'development'
  else if (isProd || isCI) preset = 'production'

  return createPerformancePreset(preset, options)
}
