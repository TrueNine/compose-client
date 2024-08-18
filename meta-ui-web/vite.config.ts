import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
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
import {viteStaticCopy} from 'vite-plugin-static-copy'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: 'MetaUI',
      entry: ['src/index.ts', 'src/unplugin/index.ts', 'src/common/index.ts'],
      fileName: '[name]',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: 'src',
        preserveModules: true
      },
      external: [
        'vue',
        /(vue-router|vue-router\/)/,
        /(highlight\.js|highlight\.js\/)/,
        /(@vueuse|@vueuse\/)/,
        /(naive-ui|naive-ui\/)/,
        /(@varlet|@varlet\/)/,
        /(vuetify|vuetify\/)/,
        /(element-plus|element-plus\/)/,
        /\.(scss|sass|less|css)/,
        /(lodash-es|lodash-es\/)/,
        /(yup|yup\/)/,
        /(vee-validate|vee-validate\/)/,
        /(@vue\/devtools-api|@vue\/devtools-api\/)/,
        /(@compose\/extensions|@compose\/extensions\/)/,
        /(dayjs|dayjs\/)/,
        /(@compose|@compose\/)/,
        /@mdi\/font/,
        /@quasar\/|quasar\/|quasar/
      ]
    }
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      clearPureImport: true,
      staticImport: true,
      entryRoot: 'src',
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        declarationDir: 'dist'
      },
      strictOutput: true,
      exclude: ['uno.config.**', 'dist/**', '__build-src__/**', 'vite.config.**', '**/__tests__/**', '**/__tests__/**', 'vitest.config.**', 'playground']
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'package.json',
          dest: '',
          transform: content => {
            const c = JSON.parse(content)
            c.scripts = {
              pub: 'pnpm publish --no-git-checks --ignore-scripts'
            }
            c.files = void 0

            Object.keys(c.exports).forEach(key => {
              const newKey = key.replace(/dist\//g, '')
              const value = c.exports[key]
              if (typeof value === 'string') {
                c.exports[newKey] = value.replace(/dist\//g, '')
              } else if (typeof value === 'object') {
                Object.keys(value).forEach(subKey => {
                  value[subKey] = value[subKey].replace(/dist\//g, '')
                })
                c.exports[newKey] = value
              }
              if (newKey !== key) delete c.exports[key]
            })

            if (c.types) c.types = c.types.replace('dist/', '')
            if (c.typings) c.typings = c.typings.replace('dist/', '')
            if (c.module) c.module = c.module.replace('dist/', '')

            return JSON.stringify(c, null, 2)
          }
        }
      ]
    }),
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
      exclude: ['dist/**']
    }),
    Components({
      dts: 'imports-comp.d.ts',
      deep: true,
      dirs: '.',
      include: ['src/**'],
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
