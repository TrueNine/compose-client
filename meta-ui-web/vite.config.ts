import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver, NaiveUiResolver, Vuetify3Resolver} from 'unplugin-vue-components/resolvers'
import unocss from 'unocss/vite'
import ViteFonts from 'unplugin-fonts/vite'
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
import type {ModuleFormat} from 'rollup'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: 'MetaUI',
      entry: ['index.ts', 'unplugin/index.ts'],
      formats: ['es', 'cjs'],
      fileName: (format: ModuleFormat) => {
        let a: string
        switch (format) {
          case 'commonjs':
          case 'cjs':
            a = 'cjs'
            break
          case 'iife':
          case 'es':
          case 'esm':
          default:
            a = 'js'
        }
        return `[name].${a}`
      }
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: '.',
        preserveModules: true
      },
      external: [
        'vue',
        /(@vueuse|@vueuse\/)/,
        /(naive-ui|naive-ui\/)/,
        /(vuetify|vuetify\/)/,
        /(element-plus|element-plus\/)/,
        /\.(scss|sass|less|css)/,
        /(lodash-es|lodash-es\/)/,
        /(dayjs|dayjs\/)/,
        /(@compose|@compose\/)/,
        /@mdi\/font/
      ]
    }
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls
      }
    }),
    vueJsx(),
    unocss(),
    dts({
      staticImport: true,
      strictOutput: true,
      clearPureImport: false,
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__test__/**', 'vitest.config.ts', 'playground']
    }),
    vuetify({}),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          vuetify: ['useTheme']
        },
        'pinia',
        'quasar',
        'vue-router',
        'vue-i18n',
        '@vueuse/core'
      ],
      dts: 'imports-auto.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './imports-eslint.json',
        globalsPropValue: true
      }
    }),
    Components({
      dts: 'imports-comp.d.ts',
      deep: true,
      dirs: '.',
      resolvers: [
        ElementPlusResolver(),
        NaiveUiResolver(),
        Vuetify3Resolver(),
        [
          {
            type: 'component',
            resolve: (name: string) => {
              if (name.match(/^(N[A-Z]|n-[a-z])/)) {
                return {
                  name,
                  from: '@compose/meta-ui-web'
                }
              }
            }
          }
        ]
      ]
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900'
          }
        ]
      }
    })
  ],
  define: {'process.env': {}},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  }
})
