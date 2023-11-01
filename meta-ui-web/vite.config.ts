import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

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
      entry: 'index.ts',
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
    vueJsx(),
    dts({
      staticImport: true,
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__test__/**', 'vitest.config.ts', 'playground']
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        },
        'pinia',
        'quasar',
        'vue-router',
        'vue-i18n',
        '@vueuse/core'
      ],
      dts: 'unplugin-auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    Components({
      dts: 'component-auto-imports.d.ts',
      deep: true,
      dirs: '.',
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  }
})
