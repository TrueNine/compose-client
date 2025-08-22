import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@truenine/config-vite'
import { defineConfig } from 'vite'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: [
          'index.ts',
          'consts/index.ts',
          'data/index.ts',
          'tools/index.ts',
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
        preset: 'monorepo',
        options: {
          enableEsbuildOptimization: true,
          enableChunkOptimization: false, // 工具库不需要复杂的代码分割
          enableDepsOptimization: true,
          chunkSizeWarningLimit: 600,
          cache: {
            enableFsCache: true,
            enableDepsCache: true,
          },
          parallel: {
            enableWorkerThreads: true,
            enableParallelCss: false,
            maxConcurrency: 4,
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
