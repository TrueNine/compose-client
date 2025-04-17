import { fileURLToPath, URL } from 'node:url'

import { configureViteFragment } from '@compose/config-vite-fragment'
import { quasar, transformAssetUrls as quasarTransformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ViteFonts from 'unplugin-fonts/vite'
import { ElementPlusResolver, NaiveUiResolver, QuasarResolver, VarletUIResolver, Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import devTools from 'vite-plugin-vue-devtools'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig(
  configureViteFragment(
    {
      additionalExternals: [
        /^@vee-validate/,
        /^zod/,
      ],
      lib: {
        entry: ['index.ts', 'unplugin/index.ts', 'common/index.ts'],
        formats: ['es'],
      },
      additionalPlugins: [
        devTools(),
        vue({
          template: {
            transformAssetUrls: {
              ...transformAssetUrls,
              ...quasarTransformAssetUrls,
            },
          },
        }),
        vueJsx(),
        unocss(),
        vuetify({
          autoImport: false,
        }),
        quasar(),
        AutoImport({
          imports: [
            'vue',
            {
              'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
              'vuetify': ['useTheme'],
            },
            'pinia',
            'quasar',
            'vue-router',
            'vue-i18n',
            '@vueuse/core',
          ],
          dts: 'imports-auto.d.ts',
          eslintrc: {
            enabled: true,
            filepath: './imports-eslint.json',
            globalsPropValue: true,
          },
          dirs: ['./src', './playground'],
          exclude: ['dist/**'],
        }),
        Components({
          dts: 'imports-comp.d.ts',
          deep: true,
          dirs: ['./src', './playground'],
          exclude: ['dist/**'],
          resolvers: [ElementPlusResolver(), NaiveUiResolver(), Vuetify3Resolver(), QuasarResolver(), VarletUIResolver()],
        }),
        ViteFonts({
          google: {
            families: [
              {
                name: 'Roboto',
                styles: 'wght@100;300;400;500;700;900',
              },
            ],
          },
        }),
      ],
    },
    {
      define: { 'process.env': {} },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      server: {
        port: 3000,
      },
    },
  ),
)
