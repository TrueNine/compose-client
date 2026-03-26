import type {LibraryFormats, Plugin} from 'vite'
import type {PackageJson} from '@/types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ENTRY_EXTENSION_PATTERN = /\.[jt]sx?$/
const SRC_PREFIX_PATTERN = /^src\/?/
const TS_ENTRY_PATTERN = /\.tsx?$/

export interface PackageJsonOptions {
  entry: string[]
  dts?: boolean
  formats?: LibraryFormats[]
  buildTool?: 'npm' | 'pnpm' | 'yarn'
}

const JS_TS_EXTENSION_PATTERN = /\.[jt]sx?$/
const SRC_PREFIX_PATTERN = /^src\/?/

function packageJsonContentReplace(content: string, options: Omit<PackageJsonOptions, 'content'>): string | undefined {
  const {entry, formats = ['es'], buildTool = 'npm', dts = true} = options

  if (formats.length === 0) return void 0
  if (content === '' || content === null || content === void 0) return void 0

  let packageJson: PackageJson
  try { packageJson = JSON.parse(content) as PackageJson }
  catch (error) { throw new Error('Failed to parse or process package.json content', {cause: error}) }
  const keysToDelete = ['scripts', 'files', 'types', 'typings', 'main', 'module', 'types', 'typings', 'exports'] as const
  keysToDelete.forEach(key => {
    if (key in packageJson) delete packageJson[key]
  })
  packageJson.scripts = {pub: `${buildTool} publish`}

  const hasEsm = formats.includes('es')
  const hasCjs = formats.includes('cjs')

  delete packageJson.main
  delete packageJson.module
  delete packageJson.types
  delete packageJson.typings

  if (hasEsm) packageJson.type = 'module'
  else if (hasCjs) packageJson.type = 'commonjs'

  const newExports: Record<string, unknown> = {}

  entry.forEach(entryPath => {
    const baseName = path.basename(entryPath).replace(JS_TS_EXTENSION_PATTERN, '')
    const dirName = path.dirname(entryPath)
    let exportKey = '.'
    let baseOutputPath = ''

    if (baseName === 'index') {
      if (dirName !== '.' && dirName !== 'src') {
        exportKey = `./${dirName.replace(SRC_PREFIX_PATTERN, '')}`
        baseOutputPath = `${dirName.replace(SRC_PREFIX_PATTERN, '')}/index`
      } else {
        exportKey = '.'
        baseOutputPath = 'index'
      }
    } else {
      const relativeDir = dirName === '.' || dirName === 'src' ? '' : `${dirName.replace(SRC_PREFIX_PATTERN, '')}/`
      exportKey = `./${relativeDir}${baseName}`
      baseOutputPath = `${relativeDir}${baseName}`
    }

    const isTypeScriptEntry = JS_TS_EXTENSION_PATTERN.test(entryPath)

    if (exportKey.startsWith('./.')) exportKey = exportKey.slice(2)
    if (exportKey === './') exportKey = '.'

    const exportValue: Record<string, string> = {}
    if (hasEsm) exportValue.import = `./${baseOutputPath}.js`
    if (hasCjs) exportValue.require = `./${baseOutputPath}.cjs`
    if (dts && isTypeScriptEntry) exportValue.types = `./${baseOutputPath}.d.ts`

    if (Object.keys(exportValue).length <= 0) return

    if (exportKey === '.') {
      if (hasEsm) packageJson.module = exportValue.import.slice(2)
      if (hasCjs) packageJson.main = exportValue.require.slice(2)
      if (dts && isTypeScriptEntry) {
        packageJson.types = exportValue.types.slice(2)
        packageJson.typings = exportValue.types.slice(2)
      } else if (!dts) {
        delete packageJson.types
        delete packageJson.typings
      }
    }
    newExports[exportKey] = exportValue
  })

  newExports['./package.json'] = './package.json'
  newExports['./*'] = './*'
  packageJson.exports = newExports as Record<string, Record<string, string>>

  return JSON.stringify(packageJson, null, 2)
}

export function PackageJsonGeneratorPlugin(options: Omit<PackageJsonOptions, 'content'>): Plugin {
  let originalContent: string
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json')
    originalContent = fs.readFileSync(packageJsonPath, 'utf8')
  }
  catch (error) { throw new Error(`Failed to read package.json from ${process.cwd()}`, {cause: error}) }

  const packageJsonContent = packageJsonContentReplace(originalContent, options)

  if (packageJsonContent === void 0) throw new Error('Failed to parse or process package.json content')

  return {
    name: 'vite-plugin-package-json-generator',
    apply: 'build',
    generateBundle(_, bundle) {
      bundle['package.json'] = {
        type: 'asset',
        fileName: 'package.json',
        source: packageJsonContent,
        name: 'package.json',
        needsCodeReference: false
      } as unknown as typeof bundle[string]
    }
  }
}
