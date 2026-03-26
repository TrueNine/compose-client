import type {UserConfig} from 'vite'
import {cpus} from 'node:os'

export interface ParallelOptimizationOptions {
  maxConcurrency?: number
  enableWorkerThreads?: boolean
  enableParallelCss?: boolean
  enableParallelTypeCheck?: boolean
}

export function getOptimalConcurrency(maxConcurrency?: number): number {
  const cpuCount = cpus().length
  const defaultConcurrency = Math.max(1, cpuCount - 1)
  if (maxConcurrency != null && maxConcurrency > 0) return Math.min(maxConcurrency, cpuCount)
  return defaultConcurrency
}

export function createParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const {enableWorkerThreads = true, enableParallelCss = true} = options

  const config: UserConfig = {}

  if (enableWorkerThreads) config.esbuild = {target: 'es2020'}

  if (enableParallelCss) config.css = {devSourcemap: true, postcss: {}}

  return config
}

export function createDevParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const baseConfig = createParallelOptimization(options)
  return {
    ...baseConfig,
    server: {hmr: {overlay: false}, warmup: {clientFiles: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.js']}},
    optimizeDeps: {esbuildOptions: {target: 'es2020', keepNames: false}}
  }
}

export function createProdParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const baseConfig = createParallelOptimization(options)

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      minify: 'esbuild'
    }
  }
}

export function createMonorepoParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const baseConfig = createParallelOptimization(options)

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      rollupOptions: {
        external: (id: string) => id.startsWith('@truenine/') || id.startsWith('workspace:')
      }
    }
  }
}
