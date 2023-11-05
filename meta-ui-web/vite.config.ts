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
        /(@vueuse|@vueuse\/)/,
        /(naive-ui|naive-ui\/)/,
        /(vuetify|vuetify\/)/,
        /(element-plus|element-plus\/)/,
        /\.(scss|sass|less|css)/,
        /(lodash-es|lodash-es\/)/,
        /(dayjs|dayjs\/)/,
        /(@compose|@compose\/)/
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
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__test__/**', 'vitest.config.ts', 'playground']
    }),
    vuetify({}),
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
      resolvers: [ElementPlusResolver(), NaiveUiResolver(), Vuetify3Resolver()]
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
