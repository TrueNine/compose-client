import type {CustomRollupConfig, InternalConfigProperties} from './CustomRollupConfig'
import {defaultConfig} from './DefaultVars'

export function getAllOutputDir(config: CustomRollupConfig) {
  return [`${config.esModuleBuildDistDirName}`, `${config.commonjsBuildDistDirName}`, `${config.umdBuildDistDirName}`, `${config.dtsBuildDistDirName}`].map(
    e => `${config.distRoot}/${e}`
  )
}

/**
 * ## 合并外部配置和默认配置
 * @param externalConfig 外部依赖
 */
export function mergeDefaultConfig(externalConfig: CustomRollupConfig): CustomRollupConfig & InternalConfigProperties {
  const cfg = {...defaultConfig, ...externalConfig}
  cfg.externals = Object.assign(defaultConfig.externals, cfg.externals)

  if (!cfg._entry) cfg._entry = defaultConfig._entry
  if (!cfg._entry) cfg._entry = `${cfg.entryRoot}/${cfg.entryFileName}`
  if (cfg.umd?.globalVarName || cfg.umd || cfg._enabledUmd) {
    cfg._enabledUmd = true
    cfg.umd!.dts = cfg.umd!.dts ?? defaultConfig.umd!.dts!
    cfg.umd!.fileName = cfg.umd!.fileName ?? defaultConfig.umd!.fileName!
    cfg.umd!.globalVarName = cfg.umd!.globalVarName ?? defaultConfig.umd!.globalVarName!
    cfg.umd!.dtsIndexName = cfg.umd!.dtsIndexName ?? defaultConfig.umd!.dtsIndexName!
  }
  if (cfg.globals) cfg.globals = Object.assign(defaultConfig.globals!, cfg.globals)

  return cfg
}
