import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { Externals } from '../vite-fragment/src/externals'
import { PackageJsonGeneratorPlugin } from '../vite-fragment/src/vite-plugin-package-json'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: [
        './src/index.ts',
      ],
      formats: ['es', 'cjs'],
      fileName: '[name]',
    },
    sourcemap: true,
    rollupOptions: {
      external: Externals,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.node.json',
      clearPureImport: true,
      staticImport: true,
      entryRoot: 'src',
      compilerOptions: {
        declaration: true,
        declarationOnly: true,
        emitDecoratorMetadata: true,
        declarationMap: true,
        declarationDir: 'dist',
      },
      strictOutput: true,
      include: ['src/**/*.ts', 'env.d.ts'],
      exclude: ['dist/**', 'node_modules/**', '**/*.spec.ts'],
    }),
    PackageJsonGeneratorPlugin({
      formats: ['es', 'cjs'],
      dts: true,
      buildTool: 'pnpm',
      entry: ['index.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
