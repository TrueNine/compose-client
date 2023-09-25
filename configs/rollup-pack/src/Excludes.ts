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
export const composeExternals: string[] = ['@compose-types/api-model', '@compose-types/req', '@compose/compose-types']

/**
 * ## node 外部库
 */
export const nodeExternals: string[] = ['node', 'fs', 'node:fs']

/**
 * ## css 的 常见 外部库
 */
export const cssExternals: string[] = [
  'sass',
  'node-sass',
  'less',
  'unocss',
  '@unocss/transformer-compile-class',
  'transformer-directives',
  'unocss-preset-weapp',
  'postcss'
]

export const allExternals: string[] = [rollupExternals, vueExternals, composeExternals, toolsExternals, oldExternals, nodeExternals, cssExternals].flat()

export const allDefaultGlobalVars: GlobalsOption = allExternals
  .map(name => {
    let variableName = name
      .replaceAll('@', '_at')
      .replaceAll('-', '_d')
      .replaceAll('.', '_do')
      .replaceAll('/', '_s')
      .replaceAll(':', '_c')
      .replaceAll('$', '_d')
      .replaceAll('\\', '_bs')
      .replaceAll(' ', '_s')
      .replaceAll('+', '_p')
      .replaceAll('?', '_qs')
      .replaceAll('~', '_t')
      .replaceAll('=', '_e')
      .replaceAll('<', '_lt')
      .replaceAll('>', '_gt')
      .replace(/[^a-zA-Z0-9_]/g, '_ud')

    if (/^[0-9]/.test(variableName)) variableName = `_${variableName}`
    return {[name]: variableName}
  })
  .reduce((prev, cur) => {
    return {...prev, ...cur}
  }, {})
