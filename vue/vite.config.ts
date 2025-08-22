import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@truenine/config-vite'
import { defineConfig } from 'vite'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: [
          'index.ts',
        ],
        formats: ['es'],
      },
      dts: { tsconfigPath: './tsconfig.lib.json' },
      packageJson: {
        buildTool: 'pnpm',
      },
      // 启用性能优化配置
      performance: {
        enabled: true,
        preset: process.env.NODE_ENV === 'development' ? 'fast-dev' : 'monorepo',
        options: {
          enableEsbuildOptimization: true,
          enableChunkOptimization: false, // 库项目不需要复杂的代码分割
          enableDepsOptimization: true,
          chunkSizeWarningLimit: 500,
          cache: {
            enableFsCache: true,
            enableDepsCache: true,
          },
          parallel: {
            enableWorkerThreads: true,
            enableParallelCss: false, // Vue 组件库通常不需要复杂的 CSS 并行处理
            maxConcurrency: process.env.NODE_ENV === 'development' ? 2 : 4,
          },
        },
      },
    },
    {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    },
  ),
)
