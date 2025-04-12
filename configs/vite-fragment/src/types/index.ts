export interface DtsConfigOptions {
  tsconfigPath?: string
}


export interface BuildLibraryConfigOptions {
  entryRoot?: string
  entry?: string[]
  sourcemap?: boolean
  formats?: ('es' | 'cjs' | 'umd' | 'iife')[]
  name?: string
  outDir?: string
  externals?: (RegExp | string)[]
  excludes?: string[]
}

export interface ManifestConfig {
  packageManager?: 'npm' | 'yarn' | 'pnpm',
  dts?: boolean | DtsConfigOptions
  lib?: boolean | BuildLibraryConfigOptions
}

export interface PackageJson {
  name?: string
  version?: string
  scripts?: Record<string, string>
  main?: string
  module?: string
  types?: string
  type?: string
  typings?: string
  packageManager?: 'npm' | 'pnpm' | 'yarn'
  exports?: Record<string, string | Record<string, string>>
  files?: string[]
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  engines?: Record<string, string>
}