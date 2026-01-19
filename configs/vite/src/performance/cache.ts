import type {UserConfig} from 'vite'

/**
 * 缓存优化配置选项
 */
export interface CacheOptimizationOptions {
  /** 是否启用文件系统缓存 */
  enableFsCache?: boolean
  /** 是否启用依赖缓存 */
  enableDepsCache?: boolean
  /** 缓存目录 */
  cacheDir?: string
  /** 是否强制清除缓存 */
  forceClearCache?: boolean
}

/**
 * 创建缓存优化配置
 */
export function createCacheOptimization(options: CacheOptimizationOptions = {}): UserConfig {
  const {enableFsCache = true, enableDepsCache = true, cacheDir = 'node_modules/.vite', forceClearCache = false} = options

  const config: UserConfig = {}

  if (enableFsCache) {
    config.cacheDir = cacheDir // 配置文件系统缓存

    config.server = {...config.server, watch: { // 优化文件监听
      ignored: [ // 忽略不需要监听的文件
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.turbo/**',
        '**/.cache/**'
      ],
      usePolling: false, // 启用轮询以提升性能
      interval: 100 // 设置合理的延迟
    }}
  }

  if (enableDepsCache) {
    config.optimizeDeps = {...config.optimizeDeps, // 优化依赖缓存配置
      force: forceClearCache, // 强制重新优化依赖
      holdUntilCrawlEnd: true} // 启用依赖哈希
  }

  return config
}

/**
 * 创建构建缓存优化配置
 */
export function createBuildCacheOptimization(): UserConfig {
  return {build: {
    write: true, // 启用构建缓存
    emptyOutDir: true, // 优化输出目录清理
    watch: null // 启用增量构建支持
  }}
}

/**
 * 创建 TypeScript 缓存优化配置
 */
export function createTypeScriptCacheOptimization(): UserConfig {
  return {esbuild: {
    tsconfigRaw: {compilerOptions: { // 启用 TypeScript 缓存
      target: 'ES2020' // 优化 TypeScript 编译选项
    }}
  }}
}
