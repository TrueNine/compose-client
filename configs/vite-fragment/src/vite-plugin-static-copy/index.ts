import {viteStaticCopy} from 'vite-plugin-static-copy'
import type {Plugin} from 'vite'

import type {ManifestConfig} from '../types'

function packageJsonContentReplace(cfg: ManifestConfig, content: string) {
  if (!content) return void 0

  const c = JSON.parse(content)
  const hasEsm = cfg.features.lib?.formats?.includes('es') ?? false
  const hasCjs = cfg.features.lib?.formats?.includes('cjs') ?? false
  const hasDts = cfg?.features?.lib?.dts?.enable
  if (!hasDts) delete c.types
  if (!hasCjs) delete c.main
  if (!hasEsm) delete c.module
  if (hasEsm && hasCjs) c.type = 'module'
  else if (hasEsm) c.type = 'module'
  else if (hasCjs) c.type = 'commonjs'

  c.scripts = {
    pub: `${cfg.features.buildTool} publish --no-git-checks --ignore-scripts`
  }
  c.files = void 0

  const distReg = new RegExp(`${cfg.build.outDir}\\/`, 'g')
  Object.keys(c.exports).forEach(key => {
    const newKey = key.replace(distReg, '')
    const value = c.exports[key]
    if (typeof value === 'string') {
      c.exports[newKey] = value.replace(distReg, '')
    } else if (typeof value === 'object') {
      Object.keys(value).forEach(subKey => {
        if (!hasDts && subKey === 'types') delete value[subKey]
        if (!hasEsm && subKey === 'import') delete value[subKey]
        if (!hasCjs && subKey === 'require') delete value[subKey]
        if (value[subKey]) value[subKey] = value[subKey].replace(distReg, '')
      })
      c.exports[newKey] = value
    }
    if (newKey !== key) delete c.exports[key]
  })

  if (c.types) c.types = c.types.replace(distReg, '')
  if (c.typings) c.typings = c.typings.replace(distReg, '')
  if (c.module) c.module = c.module.replace(distReg, '')
  if (c.main) c.module = c.module.replace(distReg, '')

  if (c.exports) c.exports['./package.json'] = './package.json'

  return JSON.stringify(c, null, 2)
}

export const StaticCopyPluginLib = (cfg: ManifestConfig): Plugin[] =>
  viteStaticCopy({
    targets: [
      {
        src: 'package.json',
        dest: '',
        transform: content => packageJsonContentReplace(cfg, content) ?? ''
      }
    ]
  })
