import type { BuildOptions, UserConfig } from 'vite'

/**
 * Vite 性能优化配置选项
 */
export interface VitePerformanceOptions {
  /** 是否启用 esbuild 优化 */
  enableEsbuildOptimization?: boolean
  /** 是否启用代码分割优化 */
  enableChunkOptimization?: boolean
  /** 是否启用依赖预构建优化 */
  enableDepsOptimization?: boolean
  /** 自定义 chunk 大小警告阈值 (KB) */
  chunkSizeWarningLimit?: number
  /** 自定义并发构建数量 */
  buildConcurrency?: number
  /** 是否启用构建报告压缩大小 */
  reportCompressedSize?: boolean
}

/**
 * 创建 esbuild 优化配置
 */
export function createEsbuildOptimization(): UserConfig['esbuild'] {
  return {
    target: 'es2020',
    keepNames: false,
    // 优化 JSX 转换
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    // 启用源码映射优化
    sourcemap: false,
  }
}

/**
 * 创建代码分割优化配置
 */
export function createChunkOptimization(): BuildOptions['rollupOptions'] {
  return {
    output: {
      // 优化 chunk 分割策略
      manualChunks: (id: string) => {
        // 将 node_modules 中的依赖分离到 vendor chunk
        if (id.includes('node_modules')) {
          // 大型库单独分包
          if (id.includes('vue') || id.includes('@vue')) return 'vue-vendor'
          if (id.includes('lodash') || id.includes('ramda')) return 'utility-vendor'
          if (id.includes('axios') || id.includes('fetch')) return 'http-vendor'
          return 'vendor'
        }

        // 将工具函数分离
        if (id.includes('/utils/') || id.includes('/helpers/')) return 'utils'

        // 将组件分离
        if (id.includes('/components/')) return 'components'
      },
      // 优化输出配置
      compact: true,
      minifyInternalExports: true,
      // 设置 chunk 文件名格式
      chunkFileNames: chunkInfo => {
        const facadeModuleId = chunkInfo.facadeModuleId
        if (facadeModuleId == null) return 'chunks/[name]-[hash].js'

        const name = (facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '')) ?? 'chunk'
        return `chunks/${name}-[hash].js`
      },
      entryFileNames: 'entries/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]',
    },
    // 优化外部依赖处理
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
  }
}

/**
 * 创建依赖预构建优化配置
 */
export function createDepsOptimization(): UserConfig['optimizeDeps'] {
  return {
    // 强制预构建的依赖
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'lodash-es',
    ],
    // 排除预构建的依赖
    exclude: [
      // 排除已经是 ESM 格式的包
      '@vueuse/core',
      '@vueuse/shared',
    ],
    // 启用依赖扫描优化
    entries: [
      'src/main.ts',
      'src/index.ts',
      'index.html',
    ],
    // 强制重新优化依赖
    force: false,
    // 启用 esbuild 优化
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true,
      },
    },
  }
}

/**
 * 创建开发服务器性能优化配置
 */
export function createDevServerOptimization(): UserConfig['server'] {
  return {
    // 优化 HMR 配置
    hmr: {
      // 减少 HMR 更新延迟
      overlay: false,
    },
    // 预热常用文件
    warmup: {
      clientFiles: [
        'src/main.ts',
        'src/App.vue',
        'src/components/**/*.vue',
      ],
    },
  }
}

/**
 * 创建完整的 Vite 性能优化配置
 */
export function createVitePerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const {
    enableEsbuildOptimization = true,
    enableChunkOptimization = true,
    enableDepsOptimization = true,
    chunkSizeWarningLimit = 1000,
    reportCompressedSize = false,
  } = options

  const config: UserConfig = {
    // 构建优化配置
    build: {
      // 设置 chunk 大小警告阈值
      chunkSizeWarningLimit,
      // 是否报告压缩后的大小
      reportCompressedSize,
      // 启用并行构建
      minify: 'esbuild',
      // 优化资源内联限制
      assetsInlineLimit: 4096,
      // CSS 代码分割
      cssCodeSplit: true,
      // 启用 CSS 压缩
      cssMinify: true,
    },
    // esbuild 配置
    esbuild: enableEsbuildOptimization ? createEsbuildOptimization() : {},
  }

  // 添加代码分割优化
  if (enableChunkOptimization) config.build!.rollupOptions = createChunkOptimization()

  // 添加依赖预构建优化
  if (enableDepsOptimization) config.optimizeDeps = createDepsOptimization()

  // 添加开发服务器优化
  config.server = createDevServerOptimization()

  return config
}

/**
 * 创建生产环境专用的性能优化配置
 */
export function createProductionPerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const baseConfig = createVitePerformanceConfig(options)

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      // 生产环境启用更激进的优化
      minify: 'esbuild',
      reportCompressedSize: true,
      // 启用 gzip 压缩分析
      rollupOptions: {
        ...baseConfig.build?.rollupOptions,
        output: {
          ...baseConfig.build?.rollupOptions?.output,
          // 生产环境使用更小的 chunk
          experimentalMinChunkSize: 1000,
        },
      },
    },
    // 生产环境禁用开发服务器优化
    server: {},
  }
}

/**
 * 创建开发环境专用的性能优化配置
 */
export function createDevelopmentPerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const baseConfig = createVitePerformanceConfig(options)

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      // 开发环境禁用压缩以提升构建速度
      minify: false,
      reportCompressedSize: false,
      // 启用源码映射
      sourcemap: true,
    },
  }
}
