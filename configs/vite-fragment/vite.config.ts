import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { Externals } from './src/externals'
import { PackageJsonGeneratorPlugin } from './src/vite-plugin-package-json'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: [
        './src/index.ts',
        './src/vite-plugin-dts/index.ts',
        './src/vite-plugin-package-json/index.ts',
        './src/externals/index.ts',
        './src/excludes/index.ts',
        './src/lib/index.ts',
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
        compact: false,
        minifyInternalExports: false,
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
      entry: ['index.ts', 'vite-plugin-dts/index.ts', 'vite-plugin-package-json/index.ts', 'externals/index.ts', 'excludes/index.ts', 'lib/index.ts'],
      buildTool: 'pnpm',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
