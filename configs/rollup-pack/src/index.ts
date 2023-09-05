import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import jsonResolve from '@rollup/plugin-json'
import type {ExternalOption, RollupOptions} from 'rollup'
import del from 'rollup-plugin-delete'
import type {Options as TerserOption} from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import copyPlugin from 'rollup-plugin-copy'
import type {CopyOptions} from 'rollup-plugin-copy'

export interface CustomRollupConfig {
  copy?: CopyOptions
  sourceDir: string
  indexName: string
  esModuleBuildDistDirName: string
  esModuleBuildFileSuffix: string
  commonjsBuildDistDirName: string
  commonjsBuildFileSuffix: string
  dtsBuildDistDirName: string
  singlePack: boolean
  externals: ExternalOption[]
  terserOption?: TerserOption
}

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
export const composeExternals: string[] = ['@compose/api-model']
export const vueExternals: string[] = ['vue', 'vue-router', 'pinia', 'vuex', '@vue/runtime-core', '@vueuse/core', '@vueuse/integration']
export const toolsExternals: string[] = ['lodash', 'lodash-es', 'moment', 'dayjs', 'sockjs-client', 'stompjs']

const defaultConfig: CustomRollupConfig = {
  sourceDir: 'src',
  indexName: 'index.ts',
  esModuleBuildDistDirName: 'es',
  esModuleBuildFileSuffix: 'mjs',
  commonjsBuildDistDirName: 'lib',
  commonjsBuildFileSuffix: 'cjs',
  dtsBuildDistDirName: 'types',
  singlePack: false,
  externals: [...rollupExternals, ...vueExternals, ...composeExternals, ...toolsExternals]
}

function mergeDefaultConfig(externalConfig: CustomRollupConfig) {
  const config = {...defaultConfig, ...externalConfig}
  config.externals = [...defaultConfig.externals, ...config.externals]

  return config
}

export function typescriptEntry(config: CustomRollupConfig = defaultConfig): RollupOptions {
  config = mergeDefaultConfig(config)
  const input = `${config.sourceDir}/${config.indexName}`

  return {
    external: config.externals,
    input,
    output: [
      {
        preserveModules: !config.singlePack,
        preserveModulesRoot: config.sourceDir,
        dir: config.esModuleBuildDistDirName,
        format: 'esm',
        entryFileNames: `[name].${config.esModuleBuildFileSuffix}`
      },
      {
        preserveModules: !config.singlePack,
        preserveModulesRoot: config.sourceDir,
        dir: config.commonjsBuildDistDirName,
        format: 'cjs',
        entryFileNames: `[name].${config.commonjsBuildFileSuffix}`
      }
    ],
    plugins: [
      del({
        targets: [`${config.esModuleBuildDistDirName}/*`, `${config.commonjsBuildDistDirName}/*`]
      }),
      resolve(),
      jsonResolve(),
      commonjs(),
      typescript(),
      terser({
        ...config.terserOption,
        ecma: 2020
      }),
      copyPlugin(config.copy)
    ]
  } as RollupOptions
}

export function declaredTypescriptFileEntry(config: CustomRollupConfig = defaultConfig): RollupOptions {
  config = mergeDefaultConfig(config)
  const input = `${config.sourceDir}/${config.indexName}`

  return {
    input: input,
    plugins: [dts()],
    output: [
      {
        preserveModules: !config.singlePack,
        dir: config.dtsBuildDistDirName
      }
    ]
  } as RollupOptions
}

export function recommendedRollupConfig(config: CustomRollupConfig = defaultConfig): RollupOptions[] {
  return [typescriptEntry(config), declaredTypescriptFileEntry(config)]
}
