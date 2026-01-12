import type {UserConfig} from 'vite'
import process from 'node:process'
import {mergeConfig} from 'vite'

import {configureViteFragment} from '../index'
import {createSmartDevelopmentOptimization} from './development'
import {createPerformancePreset, createSmartPreset} from './presets'

/**
 * 基础库项目的性能优化配置示例
 */
export function createLibraryPerformanceExample(): UserConfig {
  return configureViteFragment({lib: {entry: ['./src/index.ts'], formats: ['es', 'cjs'], sourcemap: true}, dts: true, performance: {enabled: true, preset: 'basic', options: {enableEsbuildOptimization: true, enableDepsOptimization: true, chunkSizeWarningLimit: 500}}})
}

/**
 * Vue 应用的性能优化配置示例
 */
export function createVueAppPerformanceExample(): UserConfig {
  const baseConfig: UserConfig = {
    // Vue 应用基础配置
    resolve: {alias: {'@': '/src'}},
  }

  const performanceConfig = createPerformancePreset('aggressive', {
    enableEsbuildOptimization: true,
    enableChunkOptimization: true,
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 800,
    cache: {enableFsCache: true, enableDepsCache: true},
    parallel: {enableWorkerThreads: true, enableParallelCss: true},
  })

  return mergeConfig(baseConfig, performanceConfig)
}

/**
 * Monorepo 包的性能优化配置示例
 */
export function createMonorepoPackagePerformanceExample(): UserConfig {
  return configureViteFragment({lib: {entry: ['./src/index.ts'], formats: ['es'], sourcemap: false, externals: [
    // monorepo 内部包作为外部依赖
    /^@truenine\//,
    // 常见的外部依赖
    'vue',
    'react',
    'lodash-es',
  ]}, dts: true, performance: {enabled: true, preset: 'monorepo', options: {
    enableEsbuildOptimization: true,
    // 库项目通常不需要复杂的代码分割
    enableChunkOptimization: false,
    enableDepsOptimization: true,
    cache: {enableFsCache: true, enableDepsCache: true,
      // 使用 monorepo 根目录的缓存
      cacheDir: '../../node_modules/.vite'},
    parallel: {enableWorkerThreads: true, maxConcurrency: 4},
  }}})
}

/**
 * 开发环境的性能优化配置示例
 */
export function createDevelopmentPerformanceExample(): UserConfig {
  return createPerformancePreset('development', {
    enableEsbuildOptimization: true,
    enableChunkOptimization: false,
    enableDepsOptimization: true,
    reportCompressedSize: false,
    cache: {enableFsCache: true, enableDepsCache: true, forceClearCache: false},
    parallel: {enableWorkerThreads: true, enableParallelCss: false, enableParallelTypeCheck: false},
  })
}

/**
 * 快速开发环境配置示例
 * 专为极速开发体验优化
 */
export function createFastDevelopmentPerformanceExample(): UserConfig {
  return createPerformancePreset('fast-dev', {
    enableEsbuildOptimization: true,
    enableChunkOptimization: false,
    enableDepsOptimization: true,
    reportCompressedSize: false,
    cache: {enableFsCache: true, enableDepsCache: true, forceClearCache: false},
    parallel: {enableWorkerThreads: true, enableParallelCss: false, enableParallelTypeCheck: false,
      // 减少并发以提升启动速度
      maxConcurrency: 2},
  })
}

/**
 * 高级开发环境配置示例
 */
export function createAdvancedDevelopmentExample(): UserConfig {
  const baseConfig: UserConfig = {
    // 项目特定配置
    resolve: {alias: {'@': '/src', '~': '/src'}},
  }

  const devConfig = createSmartDevelopmentOptimization({
    enableFastRefresh: true,
    enableSmartHMR: true,
    enableDepsPreBundling: true,
    enableFsCache: true,
    port: 3000,
    open: true,
    https: false,
    proxy: {'/api': {target: 'http://localhost:8080', changeOrigin: true, rewrite: (path: string) => path.replace(/^\/api/, '')}},
  })

  return mergeConfig(baseConfig, devConfig)
}

/**
 * 生产环境的性能优化配置示例
 */
export function createProductionPerformanceExample(): UserConfig {
  return createPerformancePreset('production', {
    enableEsbuildOptimization: true,
    enableChunkOptimization: true,
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    cache: {enableFsCache: true, enableDepsCache: true},
    parallel: {enableWorkerThreads: true, enableParallelCss: true, enableParallelTypeCheck: true},
  })
}

/**
 * 智能自适应性能优化配置示例
 */
export function createSmartPerformanceExample(): UserConfig {
  // 根据环境自动选择最佳配置
  return createSmartPreset({
    // 可以覆盖自动检测的配置
    enableEsbuildOptimization: true,
    cache: {enableFsCache: true, enableDepsCache: true},
  })
}

/**
 * 自定义性能优化配置示例
 */
export function createCustomPerformanceExample(): UserConfig {
  const baseConfig: UserConfig = {
    // 项目特定配置
    define: {__DEV__: JSON.stringify(process.env.NODE_ENV === 'development')},
  }

  // 组合多个性能优化配置
  const performanceConfig = createPerformancePreset('aggressive', {
    enableEsbuildOptimization: true,
    enableChunkOptimization: true,
    enableDepsOptimization: true,
    chunkSizeWarningLimit: 600,
    buildConcurrency: 6,
    cache: {enableFsCache: true, enableDepsCache: true, cacheDir: 'node_modules/.custom-cache'},
    parallel: {enableWorkerThreads: true, enableParallelCss: true, enableParallelTypeCheck: true, maxConcurrency: 8},
  })

  return mergeConfig(baseConfig, performanceConfig)
}
