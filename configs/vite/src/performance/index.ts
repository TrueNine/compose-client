import type {BuildOptions, UserConfig} from 'vite'

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
    jsxFactory: 'h', // 优化 JSX 转换
    jsxFragment: 'Fragment',
    sourcemap: false // 启用源码映射优化
  }
}

/**
 * 创建代码分割优化配置
 */
export function createChunkOptimization(): BuildOptions['rollupOptions'] {
  return {output: {
    manualChunks: (id: string) => { // 优化 chunk 分割策略
      if (id.includes('node_modules')) { // 将 node_modules 中的依赖分离到 vendor chunk
        if (id.includes('vue') || id.includes('@vue')) return 'vue-vendor' // 大型库单独分包
        if (id.includes('lodash') || id.includes('ramda')) return 'utility-vendor'
        if (id.includes('axios') || id.includes('fetch')) return 'http-vendor'
        return 'vendor'
      }

      if (id.includes('/utils/') || id.includes('/helpers/')) return 'utils' // 将工具函数分离

      if (id.includes('/components/')) return 'components' // 将组件分离
    },
    compact: true, // 优化输出配置
    minifyInternalExports: true,
    chunkFileNames: chunkInfo => { // 设置 chunk 文件名格式
      const {facadeModuleId} = chunkInfo
      if (facadeModuleId == null) return 'chunks/[name]-[hash].js'

      const name = facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '') ?? 'chunk'
      return `chunks/${name}-[hash].js`
    },
    entryFileNames: 'entries/[name]-[hash].js',
    assetFileNames: 'assets/[name]-[hash].[ext]'
  }, treeshake: {moduleSideEffects: false, propertyReadSideEffects: false, unknownGlobalSideEffects: false}} // 优化外部依赖处理
}

/**
 * 创建依赖预构建优化配置
 */
export function createDepsOptimization(): UserConfig['optimizeDeps'] {
  return {
    include: [ // 强制预构建的依赖
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'lodash-es'
    ],
    exclude: [ // 排除预构建的依赖
      '@vueuse/core', // 排除已经是 ESM 格式的包
      '@vueuse/shared'
    ],
    entries: [ // 启用依赖扫描优化
      'src/main.ts',
      'src/index.ts',
      'index.html'
    ],
    force: false, // 强制重新优化依赖
    esbuildOptions: {target: 'es2020', supported: {'top-level-await': true}} // 启用 esbuild 优化
  }
}

/**
 * 创建开发服务器性能优化配置
 */
export function createDevServerOptimization(): UserConfig['server'] {
  return {
    hmr: { // 优化 HMR 配置
      overlay: false // 减少 HMR 更新延迟
    },
    warmup: {clientFiles: [ // 预热常用文件
      'src/main.ts',
      'src/App.vue',
      'src/components/**/*.vue'
    ]}
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
    reportCompressedSize = false
  } = options

  const config: UserConfig = {
    build: { // 构建优化配置
      chunkSizeWarningLimit, // 设置 chunk 大小警告阈值
      reportCompressedSize, // 是否报告压缩后的大小
      minify: 'esbuild', // 启用并行构建
      assetsInlineLimit: 4096, // 优化资源内联限制
      cssCodeSplit: true, // CSS 代码分割
      cssMinify: true // 启用 CSS 压缩
    },
    esbuild: enableEsbuildOptimization ? createEsbuildOptimization() : {} // esbuild 配置
  }

  if (enableChunkOptimization) config.build!.rollupOptions = createChunkOptimization() // 添加代码分割优化

  if (enableDepsOptimization) config.optimizeDeps = createDepsOptimization() // 添加依赖预构建优化

  config.server = createDevServerOptimization() // 添加开发服务器优化

  return config
}

/**
 * 创建生产环境专用的性能优化配置
 */
export function createProductionPerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const baseConfig = createVitePerformanceConfig(options)

  return {...baseConfig, build: {...baseConfig.build, minify: 'esbuild', reportCompressedSize: true, // 生产环境启用更激进的优化
    rollupOptions: {...baseConfig.build?.rollupOptions, output: {...baseConfig.build?.rollupOptions?.output, // 启用 gzip 压缩分析
      experimentalMinChunkSize: 1000}}}, // 生产环境使用更小的 chunk
  server: {}} // 生产环境禁用开发服务器优化
}

/**
 * 创建开发环境专用的性能优化配置
 */
export function createDevelopmentPerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const baseConfig = createVitePerformanceConfig(options)

  return {...baseConfig, build: {...baseConfig.build, minify: false, reportCompressedSize: false, // 开发环境禁用压缩以提升构建速度
    sourcemap: true}} // 启用源码映射
}
