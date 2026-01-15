import type {OutputAsset} from 'rollup'
import type {LibraryFormats, Plugin} from 'vite'
import type {PackageJson} from '@/types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export interface PackageJsonOptions {
  entry: string[]
  dts?: boolean
  formats?: LibraryFormats[]
  buildTool?: 'npm' | 'pnpm' | 'yarn'
}

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

  const newExports: Record<string, any> = {}

  entry.forEach(entryPath => {
    const baseName = path.basename(entryPath).replace(/\.[jt]sx?$/, '') // Normalize entry path, remove src/ prefix if present, remove extension
    const dirName = path.dirname(entryPath)
    let exportKey = '.' // Construct the export key, handle index files mapping to '.' or subpaths
    let baseOutputPath = ''

    if (baseName === 'index') {
      if (dirName !== '.' && dirName !== 'src') { // If index is not in the root (e.g., src/components/index.ts), use the dir name
        exportKey = `./${dirName.replace(/^src\/?/, '')}`
        baseOutputPath = `${dirName.replace(/^src\/?/, '')}/index`
      } else {
        exportKey = '.' // Root index file (index.ts or src/index.ts)
        baseOutputPath = 'index'
      }
    } else {
      const relativeDir = dirName === '.' || dirName === 'src' ? '' : `${dirName.replace(/^src\/?/, '')}/` // Non-index files
      exportKey = `./${relativeDir}${baseName}`
      baseOutputPath = `${relativeDir}${baseName}`
    }

    const isTypeScriptEntry = /\.tsx?$/.exec(entryPath) // --- Determine if types should be generated for this entry --- START // --- Determine if types should be generated for this entry --- END

    if (exportKey.startsWith('./.')) exportKey = exportKey.slice(2) // --- Clean leading slash if relativeDir was empty initially --- START
    if (exportKey === './') exportKey = '.'

    const exportValue: Record<string, string> = {}
    if (hasEsm) exportValue.import = `./${baseOutputPath}.js`
    if (hasCjs) exportValue.require = `./${baseOutputPath}.cjs`
    if (dts && isTypeScriptEntry) exportValue.types = `./${baseOutputPath}.d.ts` // --- Generate types entry only if it's a TS/TSX file and dts is not false --- START // --- Generate types entry only if it's a TS/TSX file and dts is not false --- END

    if (Object.keys(exportValue).length <= 0) return // Only add if there are any valid export types

    if (exportKey === '.') {
      if (hasEsm) packageJson.module = exportValue.import.slice(2)
      if (hasCjs) packageJson.main = exportValue.require.slice(2)
      if (dts && isTypeScriptEntry) { // Set top-level types directly if main entry is TS and dts is not false
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
  packageJson.exports = newExports

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

  return {name: 'vite-plugin-package-json-generator', apply: 'build', generateBundle: (_, bundle) => {
    bundle['package.json'] = {
      type: 'asset',
      fileName: 'package.json',
      source: packageJsonContent,
      name: 'package.json',
      needsCodeReference: false,
    } as OutputAsset
  }}
}
