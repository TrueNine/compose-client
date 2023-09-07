import type {CopyOptions} from 'rollup-plugin-copy'
import type {ExternalOption, GlobalsOption, RollupOptions} from 'rollup'
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
   * 构建输出的总目录
   * @default 'dist'
   */
  distRoot: string

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
  externals: ExternalOption
  /**
   * terser 配置
   * @default undefined
   */
  terserOption?: TerserOption
  /**
   * umd 打包配置
   */
  umd: UmdConfig
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