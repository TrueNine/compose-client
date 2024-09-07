import * as fs from 'node:fs'
import path from 'node:path'

import {type Target, viteStaticCopy} from 'vite-plugin-static-copy'
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

  const distReg = new RegExp(`\\/${cfg.build.outDir}\\/`, 'g')
  Object.keys(c.exports).forEach(key => {
    const newKey = key.replace(distReg, '/')
    const value = c.exports[key]
    if (typeof value === 'string') {
      c.exports[newKey] = value.replace(distReg, '/')
    } else if (typeof value === 'object') {
      Object.keys(value).forEach(subKey => {
        if (!hasDts && subKey === 'types') delete value[subKey]
        if (!hasEsm && subKey === 'import') delete value[subKey]
        if (!hasCjs && subKey === 'require') delete value[subKey]
        if (value[subKey]) value[subKey] = value[subKey].replace(distReg, '/')
      })
      c.exports[newKey] = value
    }
    if (newKey !== key) delete c.exports[key]
  })

  if (c.types) c.types = c.types.replace(distReg, '/')
  if (c.typings) c.typings = c.typings.replace(distReg, '/')
  if (c.module) c.module = c.module.replace(distReg, '/')
  if (c.main) c.module = c.module.replace(distReg, '/')

  if (c.exports) {
    c.exports['./package.json'] = './package.json'
    if (cfg.features.lib.copyReadmeToDist) c.exports['./README.md'] = './README.md'
  }

  return JSON.stringify(c, null, 2)
}

const processDirectory = (dir: string, cfg: ManifestConfig) => {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) processDirectory(filePath, cfg)
    else if (file.endsWith('.map')) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      if (Array.isArray(data.sources)) {
        data.sources = data.sources.map((source: string) => {
          return cfg.features.entryRoot + '/' + source.split(`${cfg.features.entryRoot}/`)[1]
        })
      }
      fs.writeFileSync(filePath, JSON.stringify(data))
    }
  })
}

export const StaticCopyPlugin = (cfg: ManifestConfig): Plugin[] => {
  const r = [] as Target[]
  if (cfg.features.lib.copyNpmIgnoreToDist) {
    r.push({
      src: '.npmignore',
      dest: ''
    })
  }
  if (cfg.features.lib.copyReadmeToDist) {
    r.push({
      src: '{README,readme}.{md,txt,md,txt,}',
      dest: '',
      rename: 'README.md'
    })
  }
  if (cfg.features.lib.copyPackageJsonToDist)
    r.push({
      src: 'package.json',
      dest: '',
      transform: content => packageJsonContentReplace(cfg, content) ?? ''
    })
  if (cfg.features.lib.copySourceCodeToDist) {
    r.push({
      src: cfg.features.entryRoot,
      dest: ''
    })
  }
  const plugins = viteStaticCopy({
    targets: r
  })
  if (cfg.features.lib.sourcemap && cfg.features.lib.copySourceCodeToDist) {
    let outDir: string
    plugins.push({
      name: 'vite:post-handle-source-map',
      configResolved(config) {
        outDir = config.root + '/' + config.build.outDir
      },
      closeBundle() {
        processDirectory(outDir, cfg)
      }
    })
  }
  return plugins
}
