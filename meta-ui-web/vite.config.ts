import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver, NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import unocss from 'unocss/vite'

export default defineConfig({
  build: {
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
        '@vueuse/core',
        'naive-ui',
        'element-plus',
        'element-plus/es',
        'element-plus/dist',
        'element-plus/dist/locale',
        'element-plus/dist/locale/zh-cn',
        'element-plus/dist/locale/en',
        /\.(scss|sass|less|css)/,
        'lodash-es',
        'vue-router',
        '@compose/api-model',
        '@compose/compose-types',
        'dayjs',
        'dayjs/locale/zh-cn',
        'dayjs/locale/en'
      ]
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    unocss(),
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
      resolvers: [ElementPlusResolver(), NaiveUiResolver()]
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
