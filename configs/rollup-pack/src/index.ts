import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import jsonResolve from '@rollup/plugin-json'
import type {RollupOptions} from 'rollup'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'
import copyPlugin from 'rollup-plugin-copy'

import type {CustomRollupConfig} from './CustomRollupConfig'
import {defaultConfig, mergeDefaultConfig} from './DefaultVars'

export * from './CustomRollupConfig'
export * from './DefaultVars'

/**
 * # 默认的 typescript 入口配置
 * @param config 需合并的配置
 */
export function typescriptEntry(config: CustomRollupConfig = defaultConfig): RollupOptions {
  config = mergeDefaultConfig(config)
  return {
    external: config.externals,
    input: config.entry,
    output: [
      {
        generatedCode: {
          objectShorthand: true,
          constBindings: true,
          arrowFunctions: true
        },
        preserveModules: !config.singlePack,
        preserveModulesRoot: config.entryRoot,
        globals: config.globals,
        dir: config.esModuleBuildDistDirName,
        strict: true,
        esModule: true,
        compact: true,
        minifyInternalExports: true,
        format: 'esm',
        sourcemap: config.sourceMap,
        entryFileNames: `[name].${config.esModuleBuildFileSuffix}`
      },
      {
        generatedCode: {
          objectShorthand: true,
          constBindings: true,
          arrowFunctions: true
        },
        preserveModules: !config.singlePack,
        preserveModulesRoot: config.entryRoot,
        dir: config.commonjsBuildDistDirName,
        sourcemap: config.sourceMap,
        dynamicImportInCjs: true,
        compact: true,
        minifyInternalExports: true,
        strict: true,
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

/**
 * # 导出 dts 的配置
 * @param config 需合并的配置
 */
export function declaredTypescriptFileEntry(config: CustomRollupConfig = defaultConfig): RollupOptions {
  config = mergeDefaultConfig(config)

  return {
    input: config.entry,
    plugins: [dts()],
    output: [
      {
        generatedCode: {
          objectShorthand: true,
          constBindings: true,
          arrowFunctions: true
        },
        globals: config.globals,
        preserveModules: !config.singlePack,
        dir: config.dtsBuildDistDirName,
        compact: true,
        minifyInternalExports: true
      }
    ]
  } as RollupOptions
}

/**
 * # 标准 ts 项目打包配置
 * @param config 需合并的配置
 */
export function recommendedRollupConfig(config: CustomRollupConfig = defaultConfig): RollupOptions[] {
  return [typescriptEntry(config), declaredTypescriptFileEntry(config)]
}
