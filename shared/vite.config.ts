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
