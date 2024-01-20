import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

import {allExternals} from './Excludes'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      fileName: '[name]',
      entry: 'index.ts',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: '.',
        preserveModules: true
      },
      external: allExternals
    }
  },
  plugins: [
    dts({
      staticImport: true,
      tsconfigPath: './tsconfig.json',
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__tests__/**', 'vitest.config.ts']
    })
  ]
})
