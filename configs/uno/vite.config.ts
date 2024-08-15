import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      fileName: '[name]',
      entry: 'src/index.ts',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: 'src',
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
        '@compose/api-types',
        'dayjs'
      ]
    }
  },
  plugins: [
    dts({
      staticImport: true,
      clearPureImport: true,
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
