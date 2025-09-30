import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver, VarletUIResolver, Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueJsx from 'unplugin-vue-jsx/rolldown'
import Vue from 'unplugin-vue/rolldown'
import { transformAssetUrls } from 'vite-plugin-vuetify'

export const e: UserConfig = defineConfig({
  unbundle: true,
  plugins: [
    Vue({
      template: {
        transformAssetUrls: {
          ...transformAssetUrls,
        },
      },
    }),
    VueJsx(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: '.types/auto-imports.d.ts',
      eslintrc: {
        enabled: false,
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
  entry: [
    './src/index.ts',
    './src/unplugin/index.ts',
    './src/common/index.ts',
  ],
  platform: 'neutral',
  format: ['esm'],
  sourcemap: false,
  dts: {
    tsconfig: './tsconfig.build.json',
    sourcemap: false,
    vue: true,
  },
})

export default e
