import type { UserConfig } from 'vite'
import process from 'node:process'
import { mergeConfig } from 'vite'

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

  return {
    server: {
      port,
      open,
      ...(https ? { https: {} } : {}),
      proxy,
      // 启用 CORS
      cors: true,
      // 优化文件监听
      watch: {
        // 忽略不需要监听的文件和目录
        ignored: [
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
        // 使用原生文件监听以提升性能
        usePolling: false,
        // 设置合理的延迟以减少频繁触发
        interval: 100,
        // 设置深度限制以避免监听过深的目录
        depth: 99,
      },
      // 优化 HMR 配置
      hmr: enableSmartHMR
        ? {
            // 启用 HMR 端口
            port: port + 1,
            // 禁用错误覆盖层以提升性能
            overlay: false,
          }
        : false,
      // 启用文件系统缓存
      fs: enableFsCache
        ? {
            // 允许访问工作区根目录
            allow: ['..'],
            // 严格模式，提升安全性
            strict: true,
          }
        : {},
      // 预热常用文件以提升启动速度
      warmup: {
        clientFiles: [
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
        ],
        // 预热 SSR 文件
        ssrFiles: [
          'src/entry-server.ts',
          'src/entry-server.js',
        ],
      },
    },
  }
}

/**
 * 创建开发模式依赖优化配置
 */
export function createDevDepsOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const { enableDepsPreBundling = true } = options

  if (!enableDepsPreBundling) return {}

  return {
    optimizeDeps: {
      // 强制预构建的依赖
      include: [
        // Vue 生态系统
        'vue',
        'vue-router',
        'pinia',
        'vuex',
        '@vue/shared',
        // 工具库
        'lodash-es',
        'axios',
        'dayjs',
        // UI 库
        'element-plus',
        'ant-design-vue',
        'naive-ui',
        'vuetify',
        // 图标库
        '@iconify/vue',
        '@vueuse/core',
        '@vueuse/shared',
      ],
      // 排除预构建的依赖（已经是 ESM 格式或有特殊要求）
      exclude: [
        // 本地开发的包
        '@truenine/*',
        // 已经是 ESM 格式的包
        'vue-demi',
        // 有特殊要求的包
        'electron',
      ],
      // 依赖扫描入口
      entries: [
        'src/main.ts',
        'src/main.js',
        'src/index.ts',
        'src/index.js',
        'index.html',
        '*.html',
      ],
      // 开发模式不强制重新优化依赖
      force: false,
      // esbuild 优化选项
      esbuildOptions: {
        target: 'es2020',
        // 启用 top-level await 支持
        supported: {
          'top-level-await': true,
        },
        // 保持函数名以便调试
        keepNames: true,
        // 开发模式启用源码映射
        sourcemap: true,
      },
      // 启用依赖发现优化
      holdUntilCrawlEnd: true,
    },
  }
}

/**
 * 创建开发模式构建优化配置
 */
export function createDevBuildOptimization(): UserConfig {
  return {
    build: {
      // 开发模式不压缩代码以提升构建速度
      minify: false,
      // 启用源码映射以便调试
      sourcemap: true,
      // 不报告压缩后的大小以提升速度
      reportCompressedSize: false,
      // 设置较大的 chunk 警告阈值
      chunkSizeWarningLimit: 2000,
      // 禁用 CSS 代码分割以简化开发
      cssCodeSplit: false,
      // 开发模式使用更快的 CSS 处理
      cssMinify: false,
      // 优化资源内联限制
      // 开发模式不内联资源
      assetsInlineLimit: 0,
      // 启用监听模式支持
      watch: null,
    },
  }
}

/**
 * 创建开发模式 CSS 优化配置
 */
export function createDevCssOptimization(): UserConfig {
  return {
    css: {
      // 开发模式启用源码映射
      devSourcemap: true,
      // CSS 预处理器选项
      preprocessorOptions: {
        scss: {
          // 开发模式优化配置
          charset: false,
        },
        sass: {
          charset: false,
        },
        less: {
          // 启用 JavaScript
          javascriptEnabled: true,
          // 开发模式使用更快的数学运算
          math: 'always',
        },
        stylus: {
          // 启用源码映射
          sourceMap: true,
        },
      },
      // PostCSS 配置
      postcss: {
        // 开发模式使用更少的插件以提升速度
        plugins: [
          // 只保留必要的插件
        ],
      },
    },
  }
}

/**
 * 创建开发模式环境变量配置
 */
export function createDevEnvOptimization(): UserConfig {
  return {
    define: {
      // 开发模式环境变量
      '__DEV__': JSON.stringify(true),
      '__PROD__': JSON.stringify(false),
      '__TEST__': JSON.stringify(false),
      // 启用开发工具
      '__VUE_OPTIONS_API__': JSON.stringify(true),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(true),
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(true),
      // 性能监控
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    // 开发模式日志级别
    logLevel: 'info',
    // 清除控制台
    clearScreen: false,
  }
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

  return mergeConfig(
    mergeConfig(
      mergeConfig(
        mergeConfig(serverConfig, depsConfig),
        buildConfig,
      ),
      cssConfig,
    ),
    envConfig,
  )
}

/**
 * 创建 Monorepo 开发模式优化配置
 */
export function createMonorepoDevelopmentOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  const baseConfig = createDevelopmentOptimization(options)

  // Monorepo 特定的优化
  const monorepoConfig: UserConfig = {
    server: {
      // Monorepo 中的文件监听优化
      watch: {
        // 忽略其他包的 node_modules
        ignored: [
          '**/node_modules/**',
          '../../node_modules/**',
          '../*/node_modules/**',
          '../*/dist/**',
          '../*/.turbo/**',
        ],
      },
      // 启用跨包的文件服务
      fs: {
        // 允许访问 monorepo 根目录
        allow: ['../..'],
      },
    },
    optimizeDeps: {
      // Monorepo 中的依赖优化
      include: [
        ...baseConfig.optimizeDeps?.include || [],
        // 包含 workspace 依赖
      ],
      exclude: [
        ...baseConfig.optimizeDeps?.exclude || [],
        // 排除本地 workspace 包
        '@truenine/*',
        'workspace:*',
      ],
    },
    resolve: {
      // Monorepo 别名配置
      alias: {
        // 可以在这里配置 workspace 包的别名
      },
    },
  }

  return mergeConfig(baseConfig, monorepoConfig)
}

/**
 * 创建热重载优化配置
 */
export function createHMROptimization(options: { enableVueHMR?: boolean, enableReactHMR?: boolean } = {}): UserConfig {
  const { enableVueHMR = true, enableReactHMR = false } = options

  const config: UserConfig = {
    server: {
      hmr: {
        // 优化 HMR 性能
        // 禁用错误覆盖层
        overlay: false,
      },
    },
  }

  // Vue HMR 优化
  if (enableVueHMR) {
    config.define = {
      ...config.define,
      __VUE_HMR_RUNTIME__: JSON.stringify(true),
    }
  }

  // React HMR 优化
  if (enableReactHMR) {
    config.define = {
      ...config.define,
      __REACT_DEVTOOLS_GLOBAL_HOOK__: JSON.stringify(true),
    }
  }

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

  // 添加快速开发专用的优化
  const fastConfig: UserConfig = {
    server: {
      // 启用预热以加快首次访问
      warmup: {
        clientFiles: [
          'src/**/*.{vue,ts,js,tsx,jsx}',
          'index.html',
        ],
      },
    },
    optimizeDeps: {
      // 强制预构建常用依赖
      // 强制预构建常用依赖
      // 开发模式不强制重新构建
      force: false,
      // 更激进的依赖包含策略
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        'lodash-es',
        '@vueuse/core',
        '@vueuse/shared',
      ],
    },
    build: {
      // 开发模式使用最快的构建选项
      minify: false,
      sourcemap: true,
      reportCompressedSize: false,
      // 禁用不必要的优化
      cssCodeSplit: false,
      cssMinify: false,
    },
  }

  return mergeConfig(baseConfig, fastConfig)
}

/**
 * 创建智能开发模式配置
 * 根据项目类型和环境自动选择最佳配置
 */
export function createSmartDevelopmentOptimization(options: DevelopmentOptimizationOptions = {}): UserConfig {
  // 检测项目类型
  const isMonorepo = process.cwd().includes('packages')
    || process.cwd().includes('apps')
    || (process.env.PNPM_WORKSPACE_ROOT != null)

  const isVueProject = (process.env.npm_package_dependencies_vue != null)
    || (process.env.npm_package_devDependencies_vue != null)

  const isReactProject = (process.env.npm_package_dependencies_react != null)
    || (process.env.npm_package_devDependencies_react != null)

  // 基础配置
  const config = isMonorepo
    ? createMonorepoDevelopmentOptimization(options)
    : createDevelopmentOptimization(options)

  // 添加框架特定的 HMR 优化
  const hmrConfig = createHMROptimization({
    enableVueHMR: !!isVueProject,
    enableReactHMR: isReactProject,
  })

  return mergeConfig(config, hmrConfig)
}
