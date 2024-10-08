import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import jsonResolve from '@rollup/plugin-json'
import type {RollupOptions} from 'rollup'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'
import copyPlugin from 'rollup-plugin-copy'

import type {CustomRollupConfig} from './CustomRollupConfig'
import {defaultConfig, rollupDefaultGenerateCode} from './DefaultVars'
import {publishHandlePlugin, terserPlugin, umdDtsPlugin} from './plugin'
import {getAllOutputDir, mergeDefaultConfig} from './Utils'

export * from './CustomRollupConfig'
export * from './DefaultVars'
export * from './plugin'
export * from './pnpm'

/**
 * # 默认的 typescript 入口配置
 * @param config 需合并的配置
 */
export function typescriptEntry(config: Partial<CustomRollupConfig> = defaultConfig): RollupOptions {
  const cfg = mergeDefaultConfig(config as CustomRollupConfig)

  let out = {
    external: cfg.externals,
    input: cfg._entry,
    output: [
      {
        generatedCode: rollupDefaultGenerateCode,
        preserveModules: !cfg.singlePack,
        preserveModulesRoot: cfg.entryRoot,
        globals: cfg.globals,
        dir: `${cfg.distRoot}/${cfg.esDistDir}`,
        strict: true,
        esModule: true,
        compact: true,
        minifyInternalExports: true,
        format: 'es',
        sourcemap: cfg.sourceMap,
        entryFileNames: `[name].${cfg.esExtension}`
      },
      {
        generatedCode: rollupDefaultGenerateCode,
        preserveModules: !cfg.singlePack,
        preserveModulesRoot: cfg.entryRoot,
        dir: `${cfg.distRoot}/${cfg.cjsDistDir}`,
        sourcemap: cfg.sourceMap,
        dynamicImportInCjs: true,
        compact: true,
        minifyInternalExports: true,
        strict: true,
        format: 'cjs',
        entryFileNames: `[name].${cfg.cjsExtension}`
      }
    ],
    plugins: [
      cfg.rollupPlugins ? cfg.rollupPlugins : undefined,
      del({targets: getAllOutputDir(cfg).map(e => `${e}/**`)}),
      resolve({
        extensions: ['.js', '.cjs', '.mjs', '.json', '.node']
      }),
      publishHandlePlugin(cfg),
      jsonResolve(),
      commonjs({
        extensions: ['.js', '.cjs', '.mjs', '.json', '.node']
      }),
      typescript({
        exclude: getAllOutputDir(cfg).map(e => `${e}/**`)
      }),
      terserPlugin(cfg.terser, cfg),
      copyPlugin(cfg.copy)
    ]
  } as RollupOptions
  if (cfg.rollupOptions) out = cfg.rollupOptions(out)
  return out
}

/**
 * # 导出 dts 的配置
 * @param config 需合并的配置
 */
export function declaredTypescriptFileEntry(config: Partial<CustomRollupConfig> = defaultConfig): RollupOptions {
  const cfg = mergeDefaultConfig(config as CustomRollupConfig)
  return {
    input: cfg._entry,
    plugins: [dts(), cfg.rollupPlugins ? cfg.rollupPlugins : undefined],
    output: {
      globals: cfg.globals,
      preserveModules: !cfg.singlePack,
      dir: `${cfg.distRoot}/${cfg.dtsDistDir}`
    }
  }
}

export function umdPackConfig(config: Partial<CustomRollupConfig>): RollupOptions {
  const cfg = mergeDefaultConfig(config as CustomRollupConfig)
  return {
    external: cfg.externals,
    input: cfg._entry,
    output: {
      name: `${cfg.umd?.globalVarName}`,
      entryFileNames: `${cfg.umd!.fileName}.${cfg.umdBuildFileSuffix}`,
      format: 'umd',
      globals: cfg.globals!,
      dir: `${cfg.distRoot}/${cfg.umdBuildDistDirName}`,
      generatedCode: rollupDefaultGenerateCode,
      strict: true,
      esModule: true,
      compact: true,
      minifyInternalExports: true
    },
    plugins: [
      cfg.rollupPlugins ? cfg.rollupPlugins : undefined,
      resolve(),
      commonjs(),
      jsonResolve(),
      typescript({
        exclude: getAllOutputDir(cfg).map(e => `${e}/**`)
      }),
      terserPlugin(cfg.terser, cfg)
    ]
  }
}

export function umdDtsPack(config: Partial<CustomRollupConfig> = defaultConfig): RollupOptions {
  const cfg = mergeDefaultConfig(config as CustomRollupConfig)
  return {
    input: cfg._entry,
    plugins: [dts(), umdDtsPlugin(cfg), cfg.rollupPlugins ? cfg.rollupPlugins : undefined],
    output: {
      entryFileNames: `${cfg.umd?.fileName}.d.ts`,
      globals: cfg.globals,
      format: 'umd',
      dir: `${cfg.distRoot}/${cfg.umdBuildDistDirName}`
    }
  }
}

/**
 * # 标准 ts 项目打包配置
 * @param config 需合并的配置
 */
export function recommendedRollupConfig(config: Partial<CustomRollupConfig> = defaultConfig): RollupOptions[] {
  const cfg = mergeDefaultConfig(config as CustomRollupConfig)
  const packQueue = [typescriptEntry(cfg), declaredTypescriptFileEntry(cfg)]
  if (cfg._enabledUmd) {
    packQueue.push(umdPackConfig(cfg))
    if (cfg.umd?.dts) packQueue.push(umdDtsPack(cfg))
  }
  return packQueue
}
