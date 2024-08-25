import type {LibraryFormats, UserConfig} from 'vite'
import type {Options as RollupPluginTerserOptions} from '@rollup/plugin-terser'
export interface Features {
  buildTool?: 'npm' | 'pnpm' | 'yarn'
  /**
   * ## 设置当前使用的语言
   * @default 'ts'
   */
  lang?: 'ts' | 'js'
  exclude?: string[]
  /**
   * ## 入口文件 根文件夹
   * @default 'src'
   */
  entryRoot?: string
  /**
   * ## 入口 文件，相对于 entry
   * @default ['index']
   */
  entry?: string | string[]
  /**
   * ## 默认生成的 dir 文件
   * @default []
   */
  entryDirs?: string[]
  /**
   * ## 输出文件夹
   */
  dist?: string
  lib?: {
    enable?: boolean
    fileName?: string
    sourcemap?: boolean
    minify?: boolean
    minifyUnsafe?: boolean
    terserOptions?: RollupPluginTerserOptions
    dts?: {enable?: boolean}
    copyPackageJsonToDist?: boolean
    copyNpmIgnoreToDist?: boolean
    name?: string
    formats?: LibraryFormats[]
    externals?: (string | RegExp)[]
  }
}

export interface BasicConfig extends UserConfig {
  features?: Features
  pushFeatures?: Features
}
export type DeepRequiredArray<T extends any[]> = T extends Array<infer U> ? DeepRequired<U>[] : T
export type DeepRequired<T> = T extends object
  ? T extends Array<any>
    ? T
    : {
        [P in keyof T]-?: NonNullable<DeepRequired<T[P]>>
      }
  : T

export type ManifestConfig = DeepRequired<BasicConfig>
