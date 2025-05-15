import { fileURLToPath, URL } from 'node:url'
import { configureViteFragment } from '@compose/config-vite'
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
