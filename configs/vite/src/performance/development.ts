import type {UserConfig} from 'vite'
import process from 'node:process'
import {mergeConfig} from 'vite'

/**
 * 开发模式优化配置选项
 */
export interface DevelopmentOptimizationOptions {
  /** 是否启用快速刷新 */
  enableFastRefresh?: boolean
  /** 是否启用智能热重载 */
  enableSmartHMR?: boolean
  /** 是否启用依赖预构建优化 */
  enableDepsPreBundling?: boolean
  /** 是否启用文件系统缓存 */
  enableFsCache?: boolean
  /** 开发服务器端口 */
  port?: number
  /** 是否自动打开浏览器 */
  open?: boolean
  /** 是否启用 HTTPS */
  https?: boolean
  /** 自定义代理配置 */
  proxy?: Record<string, string | object>
}

/**
 * 创建开发服务器性能优化配置
 */
export function createDevServerOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const {
    enableSmartHMR = true,
    enableFsCache = true,
    port = 3000,
    open = false,
    https = false,
    proxy = {},
  } = options

  return {server: {
    port,
    open,
    ...https ? {https: {}} : {},
    proxy,
    cors: true, // 启用 CORS
    watch: { // 优化文件监听
      ignored: [ // 忽略不需要监听的文件和目录
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.turbo/**',
        '**/.cache/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/tmp/**',
        '**/temp/**',
      ],
      usePolling: false, // 使用原生文件监听以提升性能
      interval: 100, // 设置合理的延迟以减少频繁触发
      depth: 99, // 设置深度限制以避免监听过深的目录
    },
    hmr: enableSmartHMR // 优化 HMR 配置
      ? {
          port: port + 1, // 启用 HMR 端口
          overlay: false, // 禁用错误覆盖层以提升性能
        }
      : false,
    fs: enableFsCache // 启用文件系统缓存
      ? {
          allow: ['..'], // 允许访问工作区根目录
          strict: true, // 严格模式，提升安全性
        }
      : {},
    warmup: {clientFiles: [ // 预热常用文件以提升启动速度
      'src/main.ts',
      'src/main.js',
      'src/index.ts',
      'src/index.js',
      'src/App.vue',
      'src/App.tsx',
      'src/App.jsx',
      'src/components/**/*.vue',
      'src/components/**/*.tsx',
      'src/components/**/*.jsx',
      'src/pages/**/*.vue',
      'src/views/**/*.vue',
    ], ssrFiles: [ // 预热 SSR 文件
      'src/entry-server.ts',
      'src/entry-server.js',
    ]},
  }}
}

/**
 * 创建开发模式依赖优化配置
 */
export function createDevDepsOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const {enableDepsPreBundling = true} = options

  if (!enableDepsPreBundling) return {}

  return {optimizeDeps: {
    include: [ // 强制预构建的依赖
      'vue', // Vue 生态系统
      'vue-router',
      'pinia',
      'vuex',
      '@vue/shared',
      'lodash-es', // 工具库
      'axios',
      'dayjs',
      'element-plus', // UI 库
      'ant-design-vue',
      'naive-ui',
      'vuetify',
      '@iconify/vue', // 图标库
      '@vueuse/core',
      '@vueuse/shared',
    ],
    exclude: [ // 排除预构建的依赖（已经是 ESM 格式或有特殊要求）
      '@truenine/*', // 本地开发的包
      'vue-demi', // 已经是 ESM 格式的包
      'electron', // 有特殊要求的包
    ],
    entries: [ // 依赖扫描入口
      'src/main.ts',
      'src/main.js',
      'src/index.ts',
      'src/index.js',
      'index.html',
      '*.html',
    ],
    force: false, // 开发模式不强制重新优化依赖
    esbuildOptions: {target: 'es2020', // esbuild 优化选项
      supported: {'top-level-await': true}, // 启用 top-level await 支持
      keepNames: true, // 保持函数名以便调试
      sourcemap: true}, // 开发模式启用源码映射
    holdUntilCrawlEnd: true, // 启用依赖发现优化
  }}
}

/**
 * 创建开发模式构建优化配置
 */
export function createDevBuildOptimization(): UserConfig {
  return {build: {
    minify: false, // 开发模式不压缩代码以提升构建速度
    sourcemap: true, // 启用源码映射以便调试
    reportCompressedSize: false, // 不报告压缩后的大小以提升速度
    chunkSizeWarningLimit: 2000, // 设置较大的 chunk 警告阈值
    cssCodeSplit: false, // 禁用 CSS 代码分割以简化开发
    cssMinify: false, // 开发模式使用更快的 CSS 处理
    assetsInlineLimit: 0, // 开发模式不内联资源 // 优化资源内联限制
    watch: null, // 启用监听模式支持
  }}
}

/**
 * 创建开发模式 CSS 优化配置
 */
export function createDevCssOptimization(): UserConfig {
  return {css: {
    devSourcemap: true, // 开发模式启用源码映射
    preprocessorOptions: {scss: { // CSS 预处理器选项
      charset: false, // 开发模式优化配置
    }, sass: {charset: false}, less: {
      javascriptEnabled: true, // 启用 JavaScript
      math: 'always', // 开发模式使用更快的数学运算
    }, stylus: {
      sourceMap: true, // 启用源码映射
    }},
    postcss: { // PostCSS 配置
      plugins: [ // 开发模式使用更少的插件以提升速度
      ], // 只保留必要的插件
    },
  }}
}

/**
 * 创建开发模式环境变量配置
 */
export function createDevEnvOptimization(): UserConfig {
  return {define: {
    '__DEV__': JSON.stringify(true), // 开发模式环境变量
    '__PROD__': JSON.stringify(false),
    '__TEST__': JSON.stringify(false),
    '__VUE_OPTIONS_API__': JSON.stringify(true), // 启用开发工具
    '__VUE_PROD_DEVTOOLS__': JSON.stringify(true),
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify('development'), // 性能监控
  }, logLevel: 'info', // 开发模式日志级别
  clearScreen: false} // 清除控制台
}

/**
 * 创建完整的开发模式优化配置
 */
export function createDevelopmentOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const serverConfig = createDevServerOptimization(options)
  const depsConfig = createDevDepsOptimization(options)
  const buildConfig = createDevBuildOptimization()
  const cssConfig = createDevCssOptimization()
  const envConfig = createDevEnvOptimization()

  return mergeConfig(mergeConfig(mergeConfig(mergeConfig(serverConfig, depsConfig), buildConfig), cssConfig), envConfig)
}

/**
 * 创建 Monorepo 开发模式优化配置
 */
export function createMonorepoDevelopmentOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const baseConfig = createDevelopmentOptimization(options)

  const monorepoConfig: UserConfig = {server: { // Monorepo 特定的优化
    watch: { // Monorepo 中的文件监听优化
      ignored: [ // 忽略其他包的 node_modules
        '**/node_modules/**',
        '../../node_modules/**',
        '../*/node_modules/**',
        '../*/dist/**',
        '../*/.turbo/**',
      ],
    },
    fs: { // 启用跨包的文件服务
      allow: ['../..'], // 允许访问 monorepo 根目录
    },
  }, optimizeDeps: {
    include: [ // Monorepo 中的依赖优化
      ...baseConfig.optimizeDeps?.include ?? [],
    ], // 包含 workspace 依赖
    exclude: [
      ...baseConfig.optimizeDeps?.exclude ?? [],
      '@truenine/*', // 排除本地 workspace 包
      'workspace:*',
    ],
  }, resolve: {
    alias: { // Monorepo 别名配置
    }, // 可以在这里配置 workspace 包的别名
  }}

  return mergeConfig(baseConfig, monorepoConfig)
}

/**
 * 创建热重载优化配置
 */
export function createHMROptimization(options: {enableVueHMR?: boolean, enableReactHMR?: boolean} = {}): UserConfig {
  const {enableVueHMR = true, enableReactHMR = false} = options

  const config: UserConfig = {server: {hmr: {
    overlay: false, // 禁用错误覆盖层 // 优化 HMR 性能
  }}}

  if (enableVueHMR) config.define = {...config.define, __VUE_HMR_RUNTIME__: JSON.stringify(true)} // Vue HMR 优化

  if (enableReactHMR) config.define = {...config.define, __REACT_DEVTOOLS_GLOBAL_HOOK__: JSON.stringify(true)} // React HMR 优化

  return config
}

/**
 * 创建快速开发模式配置
 * 专为快速开发和热重载优化
 */
export function createFastDevelopmentOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const baseConfig = createDevelopmentOptimization({
    ...options,
    enableFastRefresh: true,
    enableSmartHMR: true,
    enableDepsPreBundling: true,
    enableFsCache: true,
  })

  const fastConfig: UserConfig = {server: { // 添加快速开发专用的优化
    warmup: {clientFiles: [ // 启用预热以加快首次访问
      'src/**/*.{vue,ts,js,tsx,jsx}',
      'index.html',
    ]},
  }, optimizeDeps: {
    force: false, // 开发模式不强制重新构建 // 强制预构建常用依赖 // 强制预构建常用依赖
    include: [ // 更激进的依赖包含策略
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'lodash-es',
      '@vueuse/core',
      '@vueuse/shared',
    ],
  }, build: {
    minify: false, // 开发模式使用最快的构建选项
    sourcemap: true,
    reportCompressedSize: false,
    cssCodeSplit: false, // 禁用不必要的优化
    cssMinify: false,
  }}

  return mergeConfig(baseConfig, fastConfig)
}

/**
 * 创建智能开发模式配置
 * 根据项目类型和环境自动选择最佳配置
 */
export function createSmartDevelopmentOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const isMonorepo = process.cwd().includes('packages') // 检测项目类型
    || process.cwd().includes('apps')
    || (process.env.PNPM_WORKSPACE_ROOT != null)

  const isVueProject = (process.env.npm_package_dependencies_vue != null)
    || (process.env.npm_package_devDependencies_vue != null)

  const isReactProject = (process.env.npm_package_dependencies_react != null)
    || (process.env.npm_package_devDependencies_react != null)

  const config = isMonorepo // 基础配置
    ? createMonorepoDevelopmentOptimization(options)
    : createDevelopmentOptimization(options)

  const hmrConfig = createHMROptimization({enableVueHMR: !!isVueProject, enableReactHMR: isReactProject}) // 添加框架特定的 HMR 优化

  return mergeConfig(config, hmrConfig)
}
