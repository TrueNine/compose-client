import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { configureViteFragment } from '../vite-fragment/src/index'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: ['index', 'defaults/index'],
        formats: ['es', 'cjs'],
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
