import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@compose/config-vite-fragment'
import { defineConfig } from 'vite'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: [
          'index',
          'browser/document',
          'lodash-es/index',
          'dayjs/index',
          'libarchive-js/index',
          'pdfjs-dist/index',
          'vue/index',
          'pino/index',
          'vue-router/index',
        ],
      },
      dts: { tsconfigPath: './tsconfig.extensions.json' },
      packageJson: {
        buildTool: 'pnpm',
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
