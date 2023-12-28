import fs from 'node:fs'
import path from 'node:path'

import type {DepOptimizationOptions, UserConfig} from 'vite'

import type {PluginConfig, ScssVariableDefs} from '../Def'
import {debug} from '../util'

/**
 * @param fullPath 项目根目录
 * @returns package.json 文件
 */
export function readPackageJson<T>(fullPath: string): T {
  return JSON.parse(fs.readFileSync(fullPath, {encoding: 'utf-8'}))
}

/**
 *
 * @param fileDef scss 文件内的字符串，或者直接读取的 scss字符串
 * @returns record scss 变量定义
 */
export function parseScssVariables(fileDef: string): ScssVariableDefs {
  const variables: Record<string, string> = {}
  const variableRegex = /(\$[\w-]+)\s*:\s*([^;]+);/g
  const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g
  let match
  while ((match = variableRegex.exec(fileDef)) !== null) {
    const variableLine = match[0].replace(commentRegex, '')
    const [variableName, variableValue] = variableLine.split(':').map(s => s.trim())
    variables[variableName] = variableValue
  }
  return variables as ScssVariableDefs
}

/**
 * 读取 scss 文件
 * @param fullFileName scss文件全路径
 * @returns scss 变量
 */
export function readScssVariables(fullFileName: string) {
  return parseScssVariables(fs.readFileSync(fullFileName, {encoding: 'utf-8'}))
}

/**
 * 优化一些见不得人的配置
 *
 * @param cfg 用户配置
 * @returns 拦截后的配置
 */
export function optiz(cfg: UserConfig, ucfg?: PluginConfig): UserConfig {
  const isUseTerser = ucfg?.config.optimization?.useTerser === true
  function mix(): DepOptimizationOptions {
    const de = cfg.optimizeDeps?.include
    const includes = []
    if (de) includes.push(...de)
    if (ucfg?.config?.root?.useUni) includes.push('@dcloudio/uni-ui')
    if (ucfg?.config?.root?.useVkUView) includes.push('vk-uview-ui')
    return {
      ...cfg.optimizeDeps,
      include: includes
    }
  }
  const mixCfg = {
    ...cfg,
    resolve: {
      alias: {
        '@': path.resolve(ucfg?.rootDir ?? '', 'src')
      }
    },
    // eslint-disable-next-line camelcase
    build: isUseTerser ? {minify: 'terser', terserOptions: {...cfg.build?.terserOptions, compress: {drop_console: true, drop_debugger: true}}} : undefined,
    optimizeDeps: mix()
  } as UserConfig
  debug(JSON.stringify(mixCfg, null, 2), ucfg?.debugMode ?? false)
  return mixCfg as UserConfig
}
