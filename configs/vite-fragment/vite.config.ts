import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { configureViteFragment } from './src/index'

export default defineConfig(
  configureViteFragment(
    // === Vite Fragment Options ===
    {
      lib: {
        entry: [
          'index.ts',
          'vite-plugin-dts/index.ts',
          'vite-plugin-package-json/index.ts',
          'externals/index.ts',
          'excludes/index.ts',
          'lib/index.ts',
        ],
        formats: ['es', 'cjs'],
      },
      dts: { tsconfigPath: './tsconfig.node.json' },
      packageJson: {
        buildTool: 'pnpm',
      },
    },
    // === Base Vite Config ===
    {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    },
  ),
)
