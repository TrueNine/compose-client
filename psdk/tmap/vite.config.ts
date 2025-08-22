import type { UserConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@truenine/config-vite'
import { defineConfig } from 'vite'

const config: UserConfig = defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: ['index.ts'],
      },
      dts: { tsconfigPath: './tsconfig.node.json' },
      packageJson: {
        buildTool: 'pnpm',
      },
      // 启用性能优化配置
      performance: {
        enabled: true,
        preset: 'monorepo',
        options: {
          enableEsbuildOptimization: true,
          enableChunkOptimization: false, // SDK 包不需要复杂的代码分割
          enableDepsOptimization: true,
          chunkSizeWarningLimit: 400,
          cache: {
            enableFsCache: true,
            enableDepsCache: true,
          },
          parallel: {
            enableWorkerThreads: true,
            enableParallelCss: false,
            maxConcurrency: 3,
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

export default config
