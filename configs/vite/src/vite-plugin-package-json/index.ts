import type { OutputAsset } from 'rollup'
import type { LibraryFormats, Plugin } from 'vite'
import type { PackageJson } from '@/types'
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
  const {
    entry,
    formats = ['es'],
    buildTool = 'npm',
    dts = true,
  } = options

  if (formats.length === 0) return void 0
  if (content === '' || content === null || content === void 0) return void 0

  let packageJson: PackageJson
  try {
    packageJson = JSON.parse(content) as PackageJson
  } catch (error) {
    throw new Error('Failed to parse or process package.json content', {
      cause: error,
    })
  }
  const keysToDelete = ['scripts', 'files', 'types', 'typings', 'main', 'module', 'types', 'typings', 'exports'] as const
  keysToDelete.forEach(key => {
    if (key in packageJson) delete packageJson[key]
  })
  packageJson.scripts = {
    pub: `${buildTool} publish`,
  }

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
    // Normalize entry path, remove src/ prefix if present, remove extension
    const baseName = path.basename(entryPath).replace(/\.[jt]sx?$/, '')
    const dirName = path.dirname(entryPath)
    // Construct the export key, handle index files mapping to '.' or subpaths
    let exportKey = '.'
    let baseOutputPath = ''

    if (baseName === 'index') {
      // If index is not in the root (e.g., src/components/index.ts), use the dir name
      if (dirName !== '.' && dirName !== 'src') {
        exportKey = `./${dirName.replace(/^src\/?/, '')}`
        baseOutputPath = `${dirName.replace(/^src\/?/, '')}/index`
      } else {
        // Root index file (index.ts or src/index.ts)
        exportKey = '.'
        baseOutputPath = 'index'
      }
    } else {
      // Non-index files
      const relativeDir = dirName === '.' || dirName === 'src' ? '' : `${dirName.replace(/^src\/?/, '')}/`
      exportKey = `./${relativeDir}${baseName}`
      baseOutputPath = `${relativeDir}${baseName}`
    }

    // --- Determine if types should be generated for this entry --- START
    const isTypeScriptEntry = entryPath.match(/\.tsx?$/)
    // --- Determine if types should be generated for this entry --- END

    // --- Clean leading slash if relativeDir was empty initially --- START
    if (exportKey.startsWith('./.')) exportKey = exportKey.substring(2)
    if (exportKey === './') exportKey = '.'

    const exportValue: Record<string, string> = {}
    if (hasEsm) exportValue.import = `./${baseOutputPath}.js`
    if (hasCjs) exportValue.require = `./${baseOutputPath}.cjs`
    // --- Generate types entry only if it's a TS/TSX file and dts is not false --- START
    if (dts !== false && isTypeScriptEntry) exportValue.types = `./${baseOutputPath}.d.ts`
    // --- Generate types entry only if it's a TS/TSX file and dts is not false --- END

    // Only add if there are any valid export types
    if (Object.keys(exportValue).length <= 0) return

    if (exportKey === '.') {
      if (hasEsm) packageJson.module = exportValue.import.substring(2)
      if (hasCjs) packageJson.main = exportValue.require.substring(2)
      // Set top-level types directly if main entry is TS and dts is not false
      if (dts !== false && isTypeScriptEntry) {
        packageJson.types = exportValue.types.substring(2)
        packageJson.typings = exportValue.types.substring(2)
      } else if (dts === false) {
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
    originalContent = fs.readFileSync(packageJsonPath, 'utf-8')
  } catch (error) {
    throw new Error(`Failed to read package.json from ${process.cwd()}`, {
      cause: error,
    })
  }

  const packageJsonContent = packageJsonContentReplace(originalContent, options)

  if (packageJsonContent === void 0) throw new Error('Failed to parse or process package.json content')

  return {
    name: 'vite-plugin-package-json-generator',
    apply: 'build',
    generateBundle: (_, bundle) => {
      bundle['package.json'] = {
        type: 'asset',
        fileName: 'package.json',
        source: packageJsonContent,
        name: 'package.json',
        needsCodeReference: false,
      } as OutputAsset
    },
  }
}
