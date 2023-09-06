import type {CopyOptions} from 'rollup-plugin-copy'
import type {ExternalOption, GlobalsOption} from 'rollup'
import type {Options as TerserOption} from '@rollup/plugin-terser'

/**
 * # rollup 收缩的打包配置
 */
export interface CustomRollupConfig {
  /**
   *  copy 插件配置
   */
  copy?: CopyOptions
  /**
   * src
   * @default 'src'
   */
  entryRoot: string
  /**
   * 默认的入口文件
   * @default `${entryRoot}/${entryFileName}`
   */
  entry?: string
  /**
   * 开启 sourcemap
   * @default false
   */
  sourceMap: boolean | 'inline' | 'hidden'
  /**
   * 默认的入口文件名
   * @default 'index.ts'
   */
  entryFileName: string
  /**
   * es 构建输出路径
   * @default 'es'
   */
  esModuleBuildDistDirName: string
  /**
   * es 构建输出文件后缀
   * @default 'mjs'
   */
  esModuleBuildFileSuffix: string
  /**
   * commonjs 构建输出路径
   * @default 'lib'
   */
  commonjsBuildDistDirName: string
  /**
   *  commonjs 构建输出文件后缀
   *   @default 'cjs'
   */
  commonjsBuildFileSuffix: string
  /**
   * d.ts 输出路径
   * @default 'types'
   */
  dtsBuildDistDirName: string
  /**
   * 单文件打包方式
   * @default false
   */
  singlePack: boolean
  /**
   * rollup 声明的一些全局变量
   * @default []
   */
  globals?: GlobalsOption
  /**
   * rollup 打包时排除的一些外部依赖
   * @default 一些常用的外部库
   */
  externals: ExternalOption[]
  /**
   * terser 配置
   * @default undefined
   */
  terserOption?: TerserOption
}
