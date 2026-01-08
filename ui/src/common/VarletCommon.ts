import type {BCP47} from '@truenine/types'
import type {StyleVars} from '@varlet/ui'
import {Locale, StyleProvider, Themes} from '@varlet/ui'

Locale.add('zh-CN', Locale.zhCN)

Locale.add('en', Locale.enUS)

Locale.add('en-US', Locale.enUS)
export function checkDark(dark: boolean): void {
  const darks = Themes.dark as StyleVars
  StyleProvider(dark ? null : darks)
}

export function checkLocale(b: BCP47): void {
  Locale.use(b)
}
