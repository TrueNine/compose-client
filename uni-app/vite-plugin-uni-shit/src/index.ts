import process from 'node:process'

import type {Plugin} from 'vite'

import {parseConfig, type PluginConfig} from './Def'
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
export const vitePluginRubbishUniApp = (viteCfg: PluginConfig): Plugin => {
  const rootDir = process.cwd()
  const ret = {
    name: 'abc',
    version: '0.0.1',
    enforce: 'pre' as 'pre' | 'post',
    apply: () => true,
    config: projectConfig => {
      const requiredConfig = parseConfig(rootDir, viteCfg)
      userConfigFactory(requiredConfig)
      return optiz(projectConfig, viteCfg)
    }
  } as Plugin
  if (viteCfg?.debugMode) console.log(viteCfg)
  return ret
}
