import {defineConfig, presetAttributify, presetIcons, presetUno} from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import transformerCompileClass from '@unocss/transformer-compile-class'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives(), transformerCompileClass()],
  content: {
    pipeline: {
      exclude: ['node_modules/**', 'dist/**']
    },
    filesystem: ['**/*.{scss,css,less,sass,html,js,jsx,ts,jsx,tsx,vue,svelte,astro}']
  }
})
