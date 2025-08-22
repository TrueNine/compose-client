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
          enableChunkOptimization: false, // 类型定义包不需要代码分割
          enableDepsOptimization: true,
          chunkSizeWarningLimit: 300, // 类型包通常较小
          cache: {
            enableFsCache: true,
            enableDepsCache: true,
          },
          parallel: {
            enableWorkerThreads: true,
            enableParallelCss: false,
            maxConcurrency: 2, // 类型包构建相对简单
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
