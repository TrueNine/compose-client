import type { UserConfig } from 'unocss'
import type { ThemeConfig } from './Theme'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import transformerCompileClass from '@unocss/transformer-compile-class'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetAttributify, presetIcons, presetMini, presetUno, presetWind } from 'unocss'

import { breakpoints } from './Breakpoints'
import { unoRules } from './Rules'
import { shortCuts } from './ShortCuts'

export function defaultConfig(themeConfig: ThemeConfig = {}): UserConfig<object> {
  return defineConfig({
    presets: [presetUno(), presetAttributify(), presetIcons(), presetWind(), presetMini()],
    shortcuts: shortCuts(),
    rules: unoRules(themeConfig),
    theme: { breakpoints },
    transformers: [transformerDirectives(), transformerCompileClass(), transformerAttributifyJsx()],
  })
}
