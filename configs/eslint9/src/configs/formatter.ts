import type {AntFuFormatterConfig} from '../types'

/** Formatter (Prettier) 默认配置 */
export const formatterConfig: AntFuFormatterConfig = {
  css: 'prettier',
  html: 'prettier',
  markdown: 'prettier',
  prettierOptions: {
    printWidth: 160,
    tabWidth: 2,
    arrowParens: 'avoid',
    vueIndentScriptAndStyle: true,
    useTabs: false,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'none',
    bracketSpacing: false
  }
}

/** @deprecated 使用 formatterConfig 代替 */
export const defaultFormatterConfig: AntFuFormatterConfig = formatterConfig
