import type { BuildOptions, Plugin, PluginOption, UserConfig } from 'vite'

import type { BuildLibraryConfigOptions } from './types'
import type { SimpleDtsOptions } from './vite-plugin-dts'
import type { PackageJsonOptions } from './vite-plugin-package-json'
import { Externals as defaultExternals } from './externals'
import { BuildConfigLib } from './lib'
import { createDtsPlugin } from './vite-plugin-dts'
import { PackageJsonGeneratorPlugin } from './vite-plugin-package-json'

export interface ViteFragmentOptions {
  lib?: BuildLibraryConfigOptions
  dts?: boolean | Omit<SimpleDtsOptions, 'entry'>
  packageJson?: Omit<PackageJsonOptions, 'entry' | 'formats'>
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
    fileNameMap: {
      es: '.js',
      cjs: '.cjs',
      umd: '.umd.js',
      iife: '.iife.js',
    },
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
    externals: options?.lib?.externals ?? externals,
  }
  const generatedBuildOptions = BuildConfigLib(mergedLibOptions)

  let dtsPlugin: Plugin | undefined
  if (options.dts !== false && options.dts !== void 0) {
    const dtsDefaults: SimpleDtsOptions = {
      entry: finalEntryArray,
      entryRoot: mergedLibOptions.entryRoot,
      sourcemap: mergedLibOptions.sourcemap,
      outDir: mergedLibOptions.outDir ?? 'dist',
      excludes: mergedLibOptions.excludes,
    }

    const finalDtsOptions: SimpleDtsOptions = {
      ...dtsDefaults,
      ...(options.dts === true ? dtsDefaults : options.dts),
    }
    dtsPlugin = createDtsPlugin({
      ...finalDtsOptions,
      outDir: finalDtsOptions.outDir ?? 'dist',
      sourcemap: finalDtsOptions.sourcemap ?? false,
      logLevel: 'error',
    })
  }

  const packageJsonDefaults: Omit<PackageJsonOptions, 'entry' | 'formats'> = {
    buildTool: 'pnpm',
    dts: options.packageJson?.dts ?? (options.dts !== false && options.dts !== void 0) ?? true,
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

  const generatedPlugins = [dtsPlugin, packageJsonPlugin].filter(Boolean) as Plugin[]

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
