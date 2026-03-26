import type {BuildOptions, UserConfig} from 'vite'

const EXTENSION_PATTERN = /\.[^.]*$/

export interface VitePerformanceOptions {
  enableEsbuildOptimization?: boolean
  enableChunkOptimization?: boolean
  enableDepsOptimization?: boolean
  chunkSizeWarningLimit?: number
  buildConcurrency?: number
  reportCompressedSize?: boolean
}

export function createEsbuildOptimization(): UserConfig['esbuild'] {
  return {
    target: 'es2020',
    keepNames: false,
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    sourcemap: false
  }
}

export function createChunkOptimization(): BuildOptions['rollupOptions'] {
  const output = {
    manualChunks: (id: string) => {
      if (id.includes('node_modules')) {
        if (id.includes('vue') || id.includes('@vue')) return 'vue-vendor'
        if (id.includes('lodash') || id.includes('ramda')) return 'utility-vendor'
        if (id.includes('axios') || id.includes('fetch')) return 'http-vendor'
        return 'vendor'
      }
      if (id.includes('/utils/') || id.includes('/helpers/')) return 'utils'
      if (id.includes('/components/')) return 'components'
    },
    compact: true,
    minifyInternalExports: true,
    chunkFileNames: (chunkInfo: {facadeModuleId: string | null}) => {
      const {facadeModuleId} = chunkInfo
      if (facadeModuleId == null) return 'chunks/[name]-[hash].js'
      const name = facadeModuleId.split('/').pop()?.replace(EXTENSION_PATTERN, '') ?? 'chunk'
      return `chunks/${name}-[hash].js`
    },
    entryFileNames: 'entries/[name]-[hash].js',
    assetFileNames: 'assets/[name]-[hash].[ext]'
  }
  const treeshake = {moduleSideEffects: false, propertyReadSideEffects: false, unknownGlobalSideEffects: false}
  return {output, treeshake} as BuildOptions['rollupOptions']
}

export function createDepsOptimization(): UserConfig['optimizeDeps'] {
  return {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'lodash-es'],
    exclude: ['@vueuse/core', '@vueuse/shared'],
    entries: ['src/main.ts', 'src/index.ts', 'index.html'],
    force: false,
    esbuildOptions: {target: 'es2020', supported: {'top-level-await': true}}
  }
}

export function createDevServerOptimization(): UserConfig['server'] {
  return {
    hmr: {overlay: false},
    warmup: {clientFiles: ['src/main.ts', 'src/App.vue', 'src/components/**/*.vue']}
  }
}

export function createVitePerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const {
    enableEsbuildOptimization = true,
    enableChunkOptimization = true,
    enableDepsOptimization = true,
    chunkSizeWarningLimit = 1000,
    reportCompressedSize = false
  } = options

  const config: UserConfig = {
    build: {
      chunkSizeWarningLimit,
      reportCompressedSize,
      minify: 'esbuild',
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      cssMinify: true,
      ...enableChunkOptimization && {rollupOptions: createChunkOptimization()}
    },
    esbuild: enableEsbuildOptimization ? createEsbuildOptimization() : {}
  }
  if (enableDepsOptimization) config.optimizeDeps = createDepsOptimization()
  config.server = createDevServerOptimization()

  return config
}

export function createProductionPerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const baseConfig = createVitePerformanceConfig(options)
  const baseOutput = baseConfig.build?.rollupOptions?.output as object | undefined
  const output = {...baseOutput, experimentalMinChunkSize: 1000}

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      minify: 'esbuild',
      reportCompressedSize: true,
      rollupOptions: {
        ...baseConfig.build?.rollupOptions,
        output
      }
    },
    server: {}
  } as UserConfig
}

export function createDevelopmentPerformanceConfig(options: VitePerformanceOptions = {}): UserConfig {
  const baseConfig = createVitePerformanceConfig(options)

  return {
    ...baseConfig,
    build: {
      ...baseConfig.build,
      minify: false,
      reportCompressedSize: false,
      sourcemap: true
    }
  }
}
