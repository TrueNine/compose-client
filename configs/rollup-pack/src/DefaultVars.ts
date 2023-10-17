import type {GeneratedCodeOptions} from 'rollup'

import type {CustomRollupConfig, InternalConfigProperties} from './CustomRollupConfig'
import {allDefaultGlobalVars, allExternals} from './Excludes'

/**
 * # 默认 rollup 配置
 */
export const defaultConfig: CustomRollupConfig & InternalConfigProperties = {
  entryRoot: 'src',
  entryFileName: 'index.ts',
  sourceMap: false,
  terserDropLog: true,
  esDistDir: 'es',
  esExtension: 'js',
  cjsDistDir: 'lib',
  cjsExtension: 'cjs',
  umdBuildDistDirName: 'umd',
  umdBuildFileSuffix: 'js',
  dtsDistDir: 'types',
  distRoot: 'dist',
  singlePack: false,
  enableUmd: true,
  globals: allDefaultGlobalVars,
  umd: {
    globalVarName: '$$',
    fileName: 'umd',
    dtsIndexName: 'index',
    dts: true
  },
  pub: {
    packageJsonPath: 'package.json',
    readmePath: 'README.md'
  },
  buildChain: {
    buildTool: 'pnpm'
  },
  externals: allExternals,
  _enabledUmd: true
}

export const rollupDefaultGenerateCode: GeneratedCodeOptions = {
  objectShorthand: true,
  constBindings: true,
  arrowFunctions: true
}
