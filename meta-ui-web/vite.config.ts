import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: true,
    terserOptions: {
      ecma: 2020
    },
    lib: {
      name: 'MetaUI',
      fileName: '[name]',
      entry: '403.page.ts',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: '.',
        preserveModules: true
      },
      external: ['vue', 'element-plus', /\.(scss|sass|less|css)/, 'lodash-es', 'vue-router', '@compose/api-model', '@compose/compose-types', 'dayjs']
    }
  },
  plugins: [
    vue(),
    dts({
      staticImport: true,
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__test__/**', 'vitest.config.ts']
    })
  ]
})
