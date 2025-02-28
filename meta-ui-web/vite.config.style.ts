import { fileURLToPath, URL } from 'node:url'
import { transformAssetUrls as quasarTransformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import { transformAssetUrls as vuetifyTransformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    unocss(),
    vue({
      template: {
        transformAssetUrls: {
          ...vuetifyTransformAssetUrls,
          ...quasarTransformAssetUrls,
        },
      },
    }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
