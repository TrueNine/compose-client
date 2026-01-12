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
    // 配置文件系统缓存
    config.cacheDir = cacheDir

    // 优化文件监听
    config.server = {...config.server, watch: {
      // 忽略不需要监听的文件
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.turbo/**',
        '**/.cache/**',
      ],
      // 启用轮询以提升性能
      usePolling: false,
      // 设置合理的延迟
      interval: 100,
    }}
  }

  if (enableDepsCache) {
    // 优化依赖缓存配置
    config.optimizeDeps = {...config.optimizeDeps,
      // 强制重新优化依赖
      force: forceClearCache,
      // 启用依赖哈希
      holdUntilCrawlEnd: true}
  }

  return config
}

/**
 * 创建构建缓存优化配置
 */
export function createBuildCacheOptimization(): UserConfig {
  return {build: {
    // 启用构建缓存
    write: true,
    // 优化输出目录清理
    emptyOutDir: true,
    // 启用增量构建支持
    watch: null,
  }}
}

/**
 * 创建 TypeScript 缓存优化配置
 */
export function createTypeScriptCacheOptimization(): UserConfig {
  return {esbuild: {
    // 启用 TypeScript 缓存
    tsconfigRaw: {compilerOptions: {
      // 优化 TypeScript 编译选项
      target: 'ES2020',
    }},
  }}
}
