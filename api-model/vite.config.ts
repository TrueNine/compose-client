import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  optimizeDeps: {
    exclude: ['import.meta']
  },
  build: {
    minify: 'terser',
    sourcemap: true,
    lib: {
      name: 'MetaUI',
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
        'element-plus',
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
      tsconfigPath: './tsconfig.json',
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__test__/**', 'vitest.config.ts']
    })
  ]
})
