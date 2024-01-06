import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

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
      external: ['vue', 'lodash-es', '@compose/api-model', '@compose/api-types']
    }
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__test__/**', 'vitest.config.ts']
    })
  ]
})
