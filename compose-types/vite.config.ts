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
      external: [
        'vue',
        'node:module',
        'node:fs',
        'node:child_process',
        'element-plus',
        'node:path',
        /\.(scss|sass|less|css)/,
        'lodash-es',
        'lodash-es/cloneDeep',
        'vue-router',
        '@compose/api-model',
        '@compose/compose-types',
        'dayjs'
      ]
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
