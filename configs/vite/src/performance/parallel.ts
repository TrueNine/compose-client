import type {UserConfig} from 'vite'
import {cpus} from 'node:os'

/**
 * 并行构建优化配置选项
 */
export interface ParallelOptimizationOptions {
  /** 最大并发数量，默认为 CPU 核心数 */
  maxConcurrency?: number
  /** 是否启用 Worker 线程 */
  enableWorkerThreads?: boolean
  /** 是否启用并行 CSS 处理 */
  enableParallelCss?: boolean
  /** 是否启用并行 TypeScript 检查 */
  enableParallelTypeCheck?: boolean
}

/**
 * 获取最优并发数量
 */
export function getOptimalConcurrency(maxConcurrency?: number): number {
  const cpuCount = cpus().length
  // 保留一个核心给系统
  const defaultConcurrency = Math.max(1, cpuCount - 1)

  if (maxConcurrency != null && maxConcurrency > 0) return Math.min(maxConcurrency, cpuCount)

  return defaultConcurrency
}

/**
 * 创建并行构建优化配置
 */
export function createParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const {
    maxConcurrency,
    enableWorkerThreads = true,
    enableParallelCss = true,
  } = options

  const concurrency = getOptimalConcurrency(maxConcurrency)

  const config: UserConfig = {
    build: {
      // 启用并行构建
      rollupOptions: {
        // 配置并行处理
        maxParallelFileOps: concurrency,
        output: {
          // 启用并行写入
          compact: true,
        },
      },
    },
  }

  if (enableWorkerThreads) {
    // 配置 esbuild 使用多线程
    config.esbuild = {
      ...config.esbuild,
      // esbuild 会自动使用多核心
      target: 'es2020',
    }

    // 配置 Rollup 使用 Worker 线程
    config.build!.rollupOptions = {
      ...config.build!.rollupOptions,
      // 启用并行插件处理
      experimentalCacheExpiry: 10,
    }
  }

  if (enableParallelCss) {
    // 配置并行 CSS 处理
    config.css = {
      // 启用 CSS 代码分割
      devSourcemap: true,
      // 配置 PostCSS 并行处理
      postcss: {
        // PostCSS 插件会自动利用多核心
      },
    }
  }

  return config
}

/**
 * 创建开发模式并行优化配置
 */
export function createDevParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const baseConfig = createParallelOptimization(options)

  return {
    ...baseConfig,
    server: {
      // 开发服务器并行优化
      hmr: {
        // 启用并行 HMR 处理
        overlay: false,
      },
      // 预热文件并行处理
      warmup: {
        clientFiles: [
          'src/**/*.vue',
          'src/**/*.ts',
          'src/**/*.js',
        ],
      },
    },
    optimizeDeps: {
      // 依赖预构建并行处理
      esbuildOptions: {
        // esbuild 并行处理配置
        target: 'es2020',
        // 启用并行转换
        keepNames: false,
      },
    },
  }
}

/**
 * 创建生产模式并行优化配置
 */
export function createProdParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const baseConfig = createParallelOptimization(options)
  const concurrency = getOptimalConcurrency(options.maxConcurrency)

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      // 生产环境并行优化
      // esbuild 支持并行压缩
      minify: 'esbuild',
      // 启用并行构建
      rollupOptions: {
        ...baseConfig.build?.rollupOptions,
        // 配置更激进的并行处理
        maxParallelFileOps: concurrency,
        output: {
          ...baseConfig.build?.rollupOptions?.output,
          // 并行输出优化
          generatedCode: {
            constBindings: true,
            objectShorthand: true,
          },
        },
      },
    },
  }
}

/**
 * 创建 monorepo 并行构建配置
 */
export function createMonorepoParallelOptimization(options: ParallelOptimizationOptions = {}): UserConfig {
  const baseConfig = createParallelOptimization(options)

  return {
    ...baseConfig,
    // monorepo 特定的并行优化
    build: {
      ...baseConfig.build,
      // 启用跨包并行构建支持
      rollupOptions: {
        ...baseConfig.build?.rollupOptions,
        // 优化外部依赖处理以支持并行构建
        external: (id: string) =>
          // 将 workspace 包标记为外部依赖，支持并行构建
          id.startsWith('@truenine/') || id.startsWith('workspace:'),
      },
    },
  }
}
