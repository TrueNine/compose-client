import type {PluginOption} from 'vite'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import process from 'process'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '../package.json'
import {RubbishPluginConfig, parseConfig} from './Def'
import {userConfigFactory} from './flow'
import {optiz} from './resolve'

export * from './Def'
export * from './EmptyCreate'

/**
 * # 让 uniapp 配置更友好
 *
 * @param viteCfg 插件配置
 * @returns vite 插件
 */
export const vitePluginRubbishUniApp = (viteCfg?: RubbishPluginConfig): PluginOption => {
  const rootDir = process.cwd()
  const ret = {
    name: pkg.name,
    version: pkg.version,
    enforce: 'pre' as 'pre' | 'post',
    apply: () => true,
    config: projectConfig => {
      const requiredConfig = parseConfig(rootDir, viteCfg)
      userConfigFactory(requiredConfig)
      return optiz(projectConfig, viteCfg)
    }
  } as PluginOption
  if (viteCfg?.debugMode) console.log(viteCfg)
  return ret
}
