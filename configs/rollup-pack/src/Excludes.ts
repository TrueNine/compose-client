import type {GlobalsOption} from 'rollup'

/**
 * ## rollup 常见 外部库
 */
export const rollupExternals: string[] = [
  'rollup',
  '@rollup/plugin-terser',
  '@rollup/plugin-node-resolve',
  '@rollup/plugin-commonjs',
  '@rollup/plugin-typescript',
  '@rollup/plugin-json',
  'rollup-plugin-dts',
  'rollup-plugin-delete',
  'typescript',
  'rollup-plugin-copy'
]

/**
 * ## 一些 过时的库排除
 */
export const oldExternals: string[] = ['tslib', 'vuex', 'lodash', 'axios', 'qs', 'dayjs', 'stompjs']

/**
 * ## vue 常见 外部库
 */
export const vueExternals: string[] = ['vue', 'vue-router', 'pinia', '@vue/runtime-core', '@vueuse/core', '@vueuse/integration', 'vue-i18n']

/**
 * ## 常见 工具 外部库
 */
export const toolsExternals: string[] = ['lodash-es', 'moment', 'sockjs-client', '@stomp/stompjs', 'ws']

/**
 * ## 内部项目自身常见外部库
 */
export const composeExternals: string[] = ['@compose/api-model', '@compose/req']

export const nodeExternals: string[] = ['node', 'fs', 'node:fs']

export const allExternals: string[] = [rollupExternals, vueExternals, composeExternals, toolsExternals, oldExternals, nodeExternals].flat()

export const allDefaultGlobalVars: GlobalsOption = allExternals
  .map(name => {
    let variableName = name
      .replaceAll('@', '_at_')
      .replaceAll('-', '_dash_')
      .replaceAll('.', '_dot_')
      .replaceAll('/', '_slash_')
      .replaceAll(':', '_colon_')
      .replaceAll('$', '_dollar_')
      .replaceAll('\\', '_backslash_')
      .replaceAll(' ', '_space_')
      .replaceAll('+', '_plus_')
      .replaceAll('[', '_open_bracket_')
      .replaceAll(']', '_close_bracket_')
      .replaceAll('{', '_open_brace_')
      .replaceAll('}', '_close_brace_')
      .replaceAll('(', '_open_parenthesis_')
      .replaceAll(')', '_close_parenthesis_')
      .replaceAll('*', '_asterisk_')
      .replaceAll('!', '_exclamation_')
      .replaceAll('?', '_question_')
      .replaceAll('~', '_tilde_')
      .replaceAll('^', '_caret_')
      .replaceAll('%', '_percent_')
      .replaceAll('&', '_ampersand_')
      .replaceAll('=', '_equal_')
      .replaceAll('|', '_pipe_')
      .replaceAll('"', '_double_quote_')
      .replaceAll("'", '_single_quote_')
      .replaceAll('`', '_backtick_')
      .replaceAll('<', '_less_than_')
      .replaceAll('>', '_greater_than_')
      .replaceAll(';', '_semicolon_')
      .replaceAll('\n', '_newline_')
      .replaceAll('\t', '_tab_')
      .replaceAll('\r', '_carriage_return_')
      .replaceAll('\b', '_backspace_')
      .replaceAll('\f', '_form_feed_')
      .replaceAll('\v', '_vertical_tab_')
      .replace(/[^a-zA-Z0-9_]/g, '_undefined_')

    if (/^[0-9]/.test(variableName)) variableName = `_${variableName}`
    return {[name]: variableName}
  })
  .reduce((prev, cur) => {
    return {...prev, ...cur}
  }, {})
