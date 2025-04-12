import { viteStaticCopy } from 'vite-plugin-static-copy'
import type { Plugin } from 'vite'
import type { LibraryFormats } from 'vite'
import type { Target } from 'vite-plugin-static-copy'

import type { ManifestConfig } from '@/types'

interface PackageJsonOptions {
  content?: string
  outDir?: string
  dts?: boolean
  formats?: LibraryFormats[]
  buildTool?: 'npm' | 'pnpm' | 'yarn' | 'nr'
}

function packageJsonContentReplace(options: PackageJsonOptions = {}): string | undefined {
  const {
    content,
    outDir = 'dist',
    dts = false,
    formats = [],
    buildTool = 'npm'
  } = options

  if (!formats.length) return void 0
  if (!content) return void 0

  try {
    const c = JSON.parse(content)

    const distPrefixReg = new RegExp(`^./${outDir}/`, 'g')
    const plainDistPrefixReg = new RegExp(`^${outDir}/`, 'g')

    const hasEsm = formats.includes('es')
    const hasCjs = formats.includes('cjs')

    if (!dts) {
      delete c.types
      delete c.typings
    }
    if (!hasCjs) delete c.main
    if (!hasEsm) delete c.module

    if (hasEsm) {
      c.type = 'module'
    } else if (hasCjs) {
      c.type = 'commonjs'
    } else {
      delete c.type
    }

    c.scripts = {
      pub: `${buildTool} publish --no-git-checks --ignore-scripts`,
    }
    delete c.files

    const cleanPlainPath = (p: string): string => p.replace(plainDistPrefixReg, '')
    if (typeof c.types === 'string') c.types = cleanPlainPath(c.types)
    if (typeof c.typings === 'string') c.typings = cleanPlainPath(c.typings)
    if (typeof c.module === 'string') c.module = cleanPlainPath(c.module)
    if (typeof c.main === 'string') c.main = cleanPlainPath(c.main)

    if (c.exports && typeof c.exports === 'object') {
      const cleanExportPath = (p: string): string => p.replace(distPrefixReg, './')
      const newExports: Record<string, any> = {}

      for (const key in c.exports) {
        if (!Object.prototype.hasOwnProperty.call(c.exports, key)) continue

        const newKey = key.replace(distPrefixReg, './')
        const value = c.exports[key]

        if (typeof value === 'string') {
          newExports[newKey] = cleanExportPath(value)
        } else if (typeof value === 'object' && value !== null) {
          const newValue: Record<string, string> = {}
          let hasProperties = false
          for (const subKey in value) {
            if (!Object.prototype.hasOwnProperty.call(value, subKey)) continue

            if (subKey === 'types' && !dts) continue
            if (subKey === 'import' && !hasEsm) continue
            if (subKey === 'require' && !hasCjs) continue

            const subValue = value[subKey]
            if (typeof subValue === 'string') {
              newValue[subKey] = cleanExportPath(subValue)
              hasProperties = true
            }
          }
          if (hasProperties) {
            newExports[newKey] = newValue
          }
        } else {
          newExports[newKey] = value
        }
      }

      newExports['./package.json'] = './package.json'
      c.exports = newExports
    }

    return JSON.stringify(c, null, 2)
  } catch (error) {
    console.error("Failed to parse or process package.json content:", error)
    return void 0
  }
}

export function StaticCopyPlugin(options: PackageJsonOptions): Plugin[]
export function StaticCopyPlugin(cfg: ManifestConfig): Plugin[]
export function StaticCopyPlugin(options: PackageJsonOptions | ManifestConfig): Plugin[] {
  const r = [] as Target[]

  if ('features' in options) {
    // ManifestConfig case
    const cfg = options as ManifestConfig
    if (cfg.features.lib.copyPackageJsonToDist) {
      r.push({
        src: 'package.json',
        dest: '',
        transform: (content: string) => packageJsonContentReplace({
          content,
          outDir: cfg.build.outDir,
          dts: cfg.features.lib.dts?.enable ?? false,
          formats: cfg.features.lib.formats ?? [],
          buildTool: cfg.features.buildTool
        }) ?? '',
      })
    }
  } else {
    // PackageJsonOptions case
    r.push({
      src: 'package.json',
      dest: '',
      transform: (content: string) => packageJsonContentReplace({
        content,
        ...options
      }) ?? '',
    })
  }

  return viteStaticCopy({
    targets: r
  })
}
