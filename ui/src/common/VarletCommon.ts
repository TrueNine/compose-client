import type { BCP47 } from '@compose/types'
import { Locale, StyleProvider, Themes } from '@varlet/ui'

Locale.add('zh-CN', Locale.zhCN)
Locale.add('en', Locale.enUS)
Locale.add('en-US', Locale.enUS)
export function checkDark(dark: boolean): void {
  // eslint-disable-next-line ts/no-unsafe-assignment
  const darks = Themes.dark
  // eslint-disable-next-line ts/no-unsafe-argument
  StyleProvider(dark ? null : darks)
}

export function checkLocale(b: BCP47): void {
  Locale.use(b)
}
