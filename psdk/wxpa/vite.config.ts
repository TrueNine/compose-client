import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@truenine/config-vite'
import { defineConfig } from 'vite'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: ['index.ts', 'examples/jweixin.example.js'],
      },
      dts: { tsconfigPath: './tsconfig.build.json' },
      packageJson: {
        buildTool: 'pnpm',
      },
      // 启用性能优化配置
      performance: {
        enabled: true,
        preset: 'monorepo',
        options: {
          enableEsbuildOptimization: true,
          enableChunkOptimization: false, // 微信 SDK 包不需要代码分割
          enableDepsOptimization: true,
          chunkSizeWarningLimit: 500,
          cache: {
            enableFsCache: true,
            enableDepsCache: true,
          },
          parallel: {
            enableWorkerThreads: true,
            enableParallelCss: false,
            maxConcurrency: 4, // 有多个入口点
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
