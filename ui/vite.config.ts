import type {UserConfig} from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'

import AutoImport from 'unplugin-auto-import/vite'
import {ElementPlusResolver, VarletUIResolver, Vuetify3Resolver} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'vue-router/vite'

import {defineConfig} from 'vite'
import devTools from 'vite-plugin-vue-devtools'
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
import {fileURLToPath, URL} from 'node:url'

export const e: UserConfig = defineConfig({
  plugins: [
    VueRouter({
      dts: 'playground/src/route-map.d.ts',
    }),
    Vue({template: {transformAssetUrls: {...transformAssetUrls}}}),
    devTools(),
    VueJsx(),
    unocss(),
    vuetify(),
    AutoImport({imports: ['vue', '@vueuse/core'], dts: '.types/auto-imports.d.ts', eslintrc: {enabled: true}}),
    Components({dts: '.types/components.d.ts', resolvers: [ElementPlusResolver(), Vuetify3Resolver(), VarletUIResolver()]})
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

export default e
