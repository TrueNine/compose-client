import { fileURLToPath, URL } from 'node:url'

import { configureViteFragment } from '@compose/config-vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ViteFonts from 'unplugin-fonts/vite'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import vueRouterUnplugin from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import devTools from 'vite-plugin-vue-devtools'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig(
  configureViteFragment(
    {
      lib: {
        sourcemap: true,
        entry: ['index.ts'],
      },
      additionalPlugins: [
        vueRouterUnplugin({
          routesFolder: [
            {
              src: 'playground/pages',
              path: '',
              exclude: (excluded: string[]) => [...excluded, '**/*View.vue', '**/Page.vue', '**/[A-Z]*.vue'],
              filePatterns: (filePatterns: string[]) => filePatterns,
              extensions: (extensions: string[]) => extensions,
            },
          ],
          extensions: ['.vue'],
          filePatterns: ['**/*'],
          exclude: [],
          dts: './.types/imports-typed-router.d.ts',
          routeBlockLang: 'json5',
          importMode: 'async',
          pathParser: {
            dotNesting: true,
          },
        }),
        devTools(),
        vue({
          template: {
            transformAssetUrls: {
              ...transformAssetUrls,
            },
          },
        }),
        vueJsx(),
        unocss(),
        vuetify({
          autoImport: false,
        }),
        AutoImport({
          imports: [
            'vue',
            {
              vuetify: ['useTheme'],
            },
            'vue-router',
          ],
          dts: './.types/imports-auto.d.ts',
          dirs: ['./src', './playground'],
          exclude: ['dist/**'],
        }),
        Components({
          dts: '.types/imports-comp.d.ts',
          deep: true,
          dirs: ['./src', './playground'],
          exclude: ['dist/**'],
          resolvers: [Vuetify3Resolver()],
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
      dts: { tsconfigPath: './tsconfig.vue.json' },
      packageJson: {
        buildTool: 'pnpm',
      },
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
