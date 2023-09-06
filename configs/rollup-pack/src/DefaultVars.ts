import type {CustomRollupConfig} from './CustomRollupConfig'

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
  'tslib',
  'typescript'
]
/**
 * ## vue 常见 外部库
 */
export const vueExternals: string[] = ['vue', 'vue-router', 'pinia', 'vuex', '@vue/runtime-core', '@vueuse/core', '@vueuse/integration']
/**
 * ## 常见 工具 外部库
 */
export const toolsExternals: string[] = ['lodash', 'lodash-es', 'qs', 'axios', 'moment', 'dayjs', 'sockjs-client', 'stompjs']
/**
 * ## 内部项目自身常见外部库
 */
export const composeExternals: string[] = ['@compose/api-model']

/**
 * # 默认 rollup 配置
 */
export const defaultConfig: CustomRollupConfig = {
  entryRoot: 'src',
  entryFileName: 'index.ts',
  sourceMap: false,
  esModuleBuildDistDirName: 'es',
  esModuleBuildFileSuffix: 'mjs',
  commonjsBuildDistDirName: 'lib',
  commonjsBuildFileSuffix: 'cjs',
  dtsBuildDistDirName: 'types',
  singlePack: false,
  externals: [rollupExternals, vueExternals, composeExternals, toolsExternals].flat()
}

/**
 * # 默认 rollup 配置入口文件
 */
export const input = `${defaultConfig.entryRoot}/${defaultConfig.entryFileName}`

/**
 * ## 合并外部配置和默认配置
 * @param externalConfig 外部依赖
 */
export function mergeDefaultConfig(externalConfig: CustomRollupConfig): CustomRollupConfig {
  const config = {...defaultConfig, ...externalConfig}
  config.externals = [...defaultConfig.externals, ...config.externals]
  if (!config.entry) config.entry = `${config.entryRoot}/${config.entryFileName}`

  return config
}
