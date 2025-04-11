import {defineConfig, presetAttributify, presetMini, presetIcons, presetUno, presetWind} from 'unocss'
import {default as transformerDirectives} from '@unocss/transformer-directives'
import {default as transformerCompileClass} from '@unocss/transformer-compile-class'
import {default as transformerAttributifyJsx} from '@unocss/transformer-attributify-jsx'
import type {ThemeConfig} from './Theme'

import {shortCuts} from './ShortCuts'
import {breakpoints} from './Breakpoints'
import {unoRules} from './Rules'

export const defaultConfig = (themeConfig: ThemeConfig = {}) =>
  defineConfig({
    presets: [presetUno(), presetAttributify(), presetIcons(), presetWind(), presetMini()],
    shortcuts: shortCuts(),
    rules: unoRules(themeConfig),
    theme: {breakpoints},
    transformers: [transformerDirectives(), transformerCompileClass(), transformerAttributifyJsx()]
  })
