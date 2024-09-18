import {defineConfig, presetAttributify, presetMini, presetIcons, presetUno, presetWind} from 'unocss'
import {default as transformerDirectives} from '@unocss/transformer-directives'
import {default as transformerCompileClass} from '@unocss/transformer-compile-class'
import {default as transformerAttributifyJsx} from '@unocss/transformer-attributify-jsx'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetWind(),
    presetMini({
      dark: 'media'
    })
  ],
  transformers: [transformerDirectives(), transformerCompileClass(), transformerAttributifyJsx()]
})
