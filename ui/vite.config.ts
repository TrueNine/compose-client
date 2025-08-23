import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'

import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver, VarletUIResolver, Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'
import devTools from 'vite-plugin-vue-devtools'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export const e: UserConfig = defineConfig({
  plugins: [
    Vue({
      template: {
        transformAssetUrls: {
          ...transformAssetUrls,
        },
      },
    }),
    devTools(),
    VueJsx(),
    unocss(),
    vuetify(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: '.types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dts: '.types/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
        Vuetify3Resolver(),
        VarletUIResolver(),
      ],
    }),
  ],
})

export default e
