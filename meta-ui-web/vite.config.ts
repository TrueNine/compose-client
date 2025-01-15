import {fileURLToPath, URL} from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver, NaiveUiResolver, QuasarResolver, VarletUIResolver, Vuetify3Resolver} from 'unplugin-vue-components/resolvers'
import unocss from 'unocss/vite'
import ViteFonts from 'unplugin-fonts/vite'
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
//import type {ModuleFormat} from 'rollup'
import {quasar, transformAssetUrls as quasarTransformAssetUrls} from '@quasar/vite-plugin'
import devTools from 'vite-plugin-vue-devtools'
import {manifest} from '@compose/config-vite-fragment'
const {defineConfig, buildConfigLib, dtsPlugin, staticCopyPluginPackageJson} = manifest({
  pushFeatures: {
    lib: {
      externals: [/playground\/main/, /\.html$/]
    }
  },
  features: {
    lang: 'ts',
    entry: ['index', 'unplugin/index', 'common/index'],
    lib: {
      dts: {
        dtsSourcemap: true
      },
      sourcemap: true
    }
  }
})

export default defineConfig({
  build: buildConfigLib(),
  plugins: [
    dtsPlugin(),
    devTools(),
    staticCopyPluginPackageJson(),
    vue({
      template: {
        transformAssetUrls: {
          ...transformAssetUrls,
          ...quasarTransformAssetUrls
        }
      }
    }),
    vueJsx(),
    unocss(),
    vuetify({
      autoImport: false
    }),
    quasar(),
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
      },
      dirs: ['./src', './playground'],
      exclude: ['dist/**']
    }),
    Components({
      dts: 'imports-comp.d.ts',
      deep: true,
      dirs: ['./src', './playground'],
      exclude: ['dist/**'],
      resolvers: [ElementPlusResolver(), NaiveUiResolver(), Vuetify3Resolver(), QuasarResolver(), VarletUIResolver()]
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
