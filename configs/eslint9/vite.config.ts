import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { configureViteFragment } from '../vite/src'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: ['index.ts', 'defaults/index.ts'],
        formats: ['es', 'cjs'],
      },
      dts: { tsconfigPath: './tsconfig.lib.json' },
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
