import {defineConfig} from 'vite'
import unocss from 'unocss/vite'
import {fileURLToPath, URL} from 'node:url'

import vue from '@vitejs/plugin-vue'
import {transformAssetUrls as quasarTransformAssetUrls} from '@quasar/vite-plugin'
import {transformAssetUrls as vuetifyTransformAssetUrls} from 'vite-plugin-vuetify'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    unocss(),
    vue({
      template: {
        transformAssetUrls: {
          ...vuetifyTransformAssetUrls,
          ...quasarTransformAssetUrls
        }
      }
    }),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
