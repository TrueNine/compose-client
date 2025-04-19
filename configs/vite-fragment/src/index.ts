import type { BuildOptions, Plugin, PluginOption, UserConfig } from 'vite'

import type { BuildLibraryConfigOptions } from './types'
import type { SimpleDtsOptions } from './vite-plugin-dts'
import type { PackageJsonOptions } from './vite-plugin-package-json'
import { Externals as defaultExternals } from './externals'
import { BuildConfigLib } from './lib'
import { createDtsPlugin } from './vite-plugin-dts'
import { PackageJsonGeneratorPlugin } from './vite-plugin-package-json'

interface LibOptions extends Omit<BuildLibraryConfigOptions, 'externals' | 'entry'> {
  entry?: string | string[]
}

interface DtsOptions extends Omit<SimpleDtsOptions, 'entry'> {
}

interface PackageJsonGenOptions extends Omit<PackageJsonOptions, 'entry' | 'formats'> {
}

export interface ViteFragmentOptions {
  lib?: LibOptions
  dts?: DtsOptions
  packageJson?: PackageJsonGenOptions
  additionalExternals?: (string | RegExp)[]
  additionalPlugins?: PluginOption[]
}

export function configureViteFragment(
  options: ViteFragmentOptions = {},
  baseConfig: UserConfig = {},
): UserConfig {
  const externals = [...defaultExternals, ...(options.additionalExternals ?? [])]

  const libDefaults: Partial<BuildLibraryConfigOptions> & { entry: string[] } = {
    entry: ['./src/index.ts'],
    entryRoot: 'src',
    outDir: 'dist',
    formats: ['es'] as const,
    sourcemap: false,
    name: 'index',
    excludes: ['**/__tests__/**', '**/__test__/**', '**/__build-src__/**', '**/*.spec.ts', '**/*.test.ts'],
  }

  const userOrDefaultEntry = options.lib?.entry ?? libDefaults.entry
  const finalEntryArray = Array.isArray(userOrDefaultEntry) ? userOrDefaultEntry : [userOrDefaultEntry]

  const entryRoot = options.lib?.entryRoot ?? libDefaults.entryRoot ?? 'src'
  const resolvedEntryArray = finalEntryArray.map((entryPath) => {
    if (entryPath.startsWith('./') || entryPath.startsWith('/') || entryRoot === '.') {
      return entryPath
    }
    const root = entryRoot.endsWith('/') ? entryRoot.slice(0, -1) : entryRoot
    const path = entryPath.startsWith('/') ? entryPath.slice(1) : entryPath
    return `${root}/${path}`
  })

  const mergedLibOptions: BuildLibraryConfigOptions = {
    ...libDefaults,
    ...options.lib,
    entry: resolvedEntryArray,
    entryRoot,
    externals,
  }
  const generatedBuildOptions = BuildConfigLib(mergedLibOptions)

  const dtsDefaults: SimpleDtsOptions = {
    entry: finalEntryArray,
    entryRoot: mergedLibOptions.entryRoot,
    sourcemap: mergedLibOptions.sourcemap,
    outDir: mergedLibOptions.outDir ?? 'dist',
    excludes: mergedLibOptions.excludes,
  }

  const finalDtsOptions: SimpleDtsOptions = {
    ...dtsDefaults,
    ...options.dts,
  }

  const dtsPlugin = createDtsPlugin({
    ...finalDtsOptions,
    outDir: typeof finalDtsOptions.outDir === 'string' ? finalDtsOptions.outDir : 'dist',
    sourcemap: finalDtsOptions.sourcemap,
    logLevel: 'error',
  })

  const packageJsonDefaults: Required<Pick<PackageJsonOptions, 'buildTool'>> = {
    buildTool: 'npm',
  }

  const finalPackageJsonOptions: PackageJsonOptions = {
    ...packageJsonDefaults,
    ...options.packageJson,
    entry: resolvedEntryArray,
    formats: mergedLibOptions.formats,
  }

  const packageJsonPlugin = PackageJsonGeneratorPlugin(finalPackageJsonOptions as Omit<PackageJsonOptions, 'content'>)

  const mergedBuildOptions: BuildOptions = {
    ...baseConfig.build,
    ...generatedBuildOptions,
  }

  const generatedPlugins = [dtsPlugin, packageJsonPlugin] as Plugin[]

  const basePluginsArray = (
    Array.isArray(baseConfig.plugins)
      ? baseConfig.plugins
      : [baseConfig.plugins ?? []]
  ).flat()

  const basePluginsNormalized = basePluginsArray.filter(Boolean) as Plugin[]

  const mergedPlugins: PluginOption[] = [
    ...basePluginsNormalized,
    ...generatedPlugins,
    ...(options.additionalPlugins ?? []),
  ]

  const finalConfig: UserConfig = {
    ...baseConfig,
    build: mergedBuildOptions,
    plugins: mergedPlugins,
  }

  return finalConfig
}
