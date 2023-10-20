import type {CopyOptions} from 'rollup-plugin-copy'
import type {ExternalOption, GlobalsOption, RollupOptions} from 'rollup'
import type {Options as TerserOption} from '@rollup/plugin-terser'

import type {Nullable} from './adaptors/PackageAdaptor'

/**
 * # rollup 收缩的打包配置
 */
export interface CustomRollupConfig {
  /**
   *  copy 插件配置
   *  @deprecated 该接口目前暂未更新
   */
  copy?: CopyOptions
  /**
   * 开启 terser
   * @default false
   */
  terser: boolean
  /**
   * terser 打包时是否删除 console log debug
   * @default false
   */
  terserDropLog: boolean
  /**
   * src
   * @default 'src'
   */
  entryRoot: string
  /**
   * 构建输出的总目录
   * @default 'dist'
   */
  distRoot: string

  /**
   * 开启 sourcemap
   * @default true
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
  esDistDir: string
  /**
   * es 构建输出文件后缀
   * @default 'mjs'
   */
  esExtension: string
  /**
   * commonjs 构建输出路径
   * @default 'lib'
   */
  cjsDistDir: string

  /**
   * umd 构建输出路径
   * @default 'umd'
   */
  umdBuildDistDirName: string

  /**
   * umd 构建输出文件后缀名
   * @default 'min.js'
   */
  umdBuildFileSuffix: string

  /**
   *  commonjs 构建输出文件后缀
   *   @default 'cjs'
   */
  cjsExtension: string
  /**
   * d.ts 输出路径
   * @default 'types'
   */
  dtsDistDir: string
  /**
   * 单文件打包方式
   * @default false
   */
  singlePack: boolean
  /**
   * 开启 umd 打包方式
   * @default true
   */
  enableUmd: boolean
  /**
   * rollup 声明的一些全局变量
   * @default []
   */
  globals?: GlobalsOption
  /**
   * rollup 打包时排除的一些外部依赖
   * @default 一些常用的外部库
   */
  externals: ExternalOption
  /**
   * terser 配置
   * @default undefined
   */
  terserOption?: TerserOption
  /**
   * umd 打包配置
   */
  umd: Nullable<UmdConfig>
  /**
   * 其他的一些打包配置，会混合进其他配置
   *
   * 优先级高于 其他配置
   *
   * @default undefined
   */
  rollupOptions?: (options: RollupOptions) => RollupOptions
  /**
   * 发布配置
   */
  pub: PublishConfig
  /**
   * 打包工具配置
   */
  buildChain: BuildChainConfig
}

export interface PublishConfig {
  /**
   * 项目 package.json 的位置
   * @default 'package.json'
   */
  packageJsonPath?: string
  /**
   * @default 'README.md'
   */
  readmePath?: string
}

/**
 * 打包配置内部属性
 */
export interface InternalConfigProperties {
  _root?: string
  _cwd?: string
  _copySerials?: CopyOptions['targets']
  _entry?: string
  _enabledUmd?: boolean
}

export interface UmdConfig {
  /**
   *  umd 全局变量名称
   * @default '$$'
   */
  globalVarName: string
  /**
   *  umd 文件名称
   * @default 'app'
   */
  fileName?: string

  /**
   * 为 package.json 添加 umd 字段时是用的文件名
   * @default 'index'
   */
  dtsIndexName?: string
  /**
   * 是否为 umd 单独生成 dts
   * @default true
   */
  dts?: boolean
}

export interface BuildChainConfig {
  /**
   * 使用的打包工具
   * @default 'pnpm'
   */
  buildTool: 'npm' | 'yarn' | 'pnpm'
}
