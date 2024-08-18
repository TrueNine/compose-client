import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {},
    sourcemap: false,
    lib: {
      fileName: '[name]',
      entry: ['src/index.ts', 'src/tools/index.ts', 'src/typings/index.ts'],
      formats: ['es']
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: 'src',
        preserveModules: true
      },
      external: []
    }
  },
  plugins: [
    dts({
      copyDtsFiles: true,
      staticImport: true,
      entryRoot: 'src',
      tsconfigPath: './tsconfig.json',
      exclude: ['dist/**', '__build-src__/**', 'vite.config.**', '**/__tests__/**', 'vitest.config.**']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
