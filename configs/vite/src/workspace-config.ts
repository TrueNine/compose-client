import type {UserConfig as TsdownUserConfig} from 'tsdown'
import type {UserConfig as ViteUserConfig} from 'vite'
import {join} from 'node:path'
import process from 'node:process'
import {fileURLToPath} from 'node:url'
import {defineConfig as defineTsdownConfig} from 'tsdown'
import {defineConfig as defineViteConfig, mergeConfig} from 'vite'
import {configDefaults, defineConfig as defineVitestConfig} from 'vitest/config'

export interface WorkspaceImportMetaLike {
  url: string
}

export interface LibraryVitestOptions {
  environment?: 'happy-dom' | 'jsdom' | 'node'
  exclude?: string[]
  overrides?: ViteUserConfig
}

const defaultTsdownEntry = [
  './src/**/*',
  '!**/*.{spec,test}.*',
  '!**/__test__/**',
  '!**/__tests__/**'
]
const defaultTsdownDts = {sourcemap: true, tsconfig: './tsconfig.lib.json'}
const VITEST_TEMP_ROOT_SEGMENT = '/node_modules/.vite-temp/'

function resolveWorkspaceRoot(importMeta: WorkspaceImportMetaLike): string {
  const workspaceRoot = fileURLToPath(new URL('./', importMeta.url))
  if (workspaceRoot.replaceAll('\\', '/').includes(VITEST_TEMP_ROOT_SEGMENT)) return process.cwd()
  return workspaceRoot
}

function resolveWorkspaceSrc(importMeta: WorkspaceImportMetaLike): string {
  const workspaceRoot = resolveWorkspaceRoot(importMeta)
  return join(workspaceRoot, 'src')
}

function normalizeTsdownDtsOption(dts: TsdownUserConfig['dts']): TsdownUserConfig['dts'] {
  if (dts === false) return false
  if (dts === true || dts === void 0) return {...defaultTsdownDts}
  if (typeof dts === 'object') return {...defaultTsdownDts, ...dts}
  return dts
}

export function createLibraryViteConfig(importMeta: WorkspaceImportMetaLike, overrides: ViteUserConfig = {}): ViteUserConfig {
  const baseConfig = defineViteConfig({resolve: {alias: {'@': resolveWorkspaceSrc(importMeta)}}})
  return mergeConfig(baseConfig, overrides)
}

export function createLibraryVitestConfig(
  importMeta: WorkspaceImportMetaLike,
  viteConfig: ViteUserConfig = {},
  options: LibraryVitestOptions = {}
): ViteUserConfig {
  const baseVitestConfig = defineVitestConfig({
    test: {
      environment: options.environment ?? 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', ...options.exclude ?? []],
      root: resolveWorkspaceRoot(importMeta)
    }
  })

  const mergedConfig = mergeConfig(viteConfig, baseVitestConfig)
  if (options.overrides === void 0) return mergedConfig

  return mergeConfig(mergedConfig, options.overrides)
}

export function createLibraryTsdownConfig(overrides: TsdownUserConfig = {}): TsdownUserConfig {
  const {
    deps,
    dts,
    entry = defaultTsdownEntry,
    format = ['esm'],
    platform = 'neutral',
    sourcemap = true,
    unbundle = true,
    ...rest
  } = overrides

  return defineTsdownConfig({
    ...rest,
    entry,
    platform,
    sourcemap,
    unbundle,
    format,
    deps: {skipNodeModulesBundle: true, ...deps},
    dts: normalizeTsdownDtsOption(dts)
  })
}
