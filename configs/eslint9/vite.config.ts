import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { configureViteFragment } from '../vite-fragment/src/index'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        entry: [
          'index.ts',
        ],
        formats: ['es', 'cjs'],
      },
      dts: {
        tsconfigPath: './tsconfig.node.json',
        overridePluginOptions: {
          clearPureImport: true,
          staticImport: true,
          compilerOptions: {
            declaration: true,
            declarationOnly: true,
            emitDecoratorMetadata: true,
            declarationMap: false,
          },
          strictOutput: true,
          include: ['src/**/*.ts', 'env.d.ts'],
          exclude: ['dist/**', 'node_modules/**', '**/*.spec.ts'],
        },
      },
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
