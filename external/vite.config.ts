import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@truenine/config-vite'
import { defineConfig } from 'vite'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: [
          'index.ts',
          'browser/document.ts',
          'lodash-es/index.ts',
          'dayjs/index.ts',
          'libarchive-js/index.ts',
          'pdfjs-dist/index.ts',
          'vue/index.ts',
          'vue-router/index.ts',
        ],
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
          enableChunkOptimization: false, // 外部依赖包装库不需要代码分割
          enableDepsOptimization: true,
          chunkSizeWarningLimit: 800, // 外部依赖可能较大
          cache: {
            enableFsCache: true,
            enableDepsCache: true,
          },
          parallel: {
            enableWorkerThreads: true,
            enableParallelCss: false,
            maxConcurrency: 6, // 多入口点可以使用更多并发
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
