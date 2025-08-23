import type { UserConfig } from 'unocss'
import type { ThemeConfig } from './Theme'
import transformerCompileClass from '@unocss/transformer-compile-class'
import { defineConfig, presetIcons, presetMini, presetWind3, presetWind4 } from 'unocss'

import { breakpoints } from './Breakpoints'
import { unoRules } from './Rules'
import { shortCuts } from './ShortCuts'

export function defaultConfig(themeConfig: ThemeConfig = {}): UserConfig<object> {
  return defineConfig({
    presets: [presetWind4(), presetIcons(), presetWind3(), presetMini()],
    shortcuts: shortCuts(),
    rules: unoRules(themeConfig),
    theme: { breakpoints },
    transformers: [transformerCompileClass()],
  })
}
