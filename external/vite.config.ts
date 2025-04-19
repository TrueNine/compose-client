import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@compose/config-vite-fragment'
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
          'pino/index.ts',
          'vue-router/index.ts',
        ],
      },
      dts: { tsconfigPath: './tsconfig.build.json' },
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
