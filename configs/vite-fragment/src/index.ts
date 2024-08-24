import type {LibraryFormats, UserConfig} from 'vite'
import {defineConfig as viteDefineConfig, mergeConfig} from 'vite'

import {BuildConfigLib as _BuildConfigLib} from './build-lib-config'
import {DtsPlugin as _DtsPlugin} from './vite-plugin-dts'
import {Externals} from './externals'
import {StaticCopyPluginLib} from './vite-plugin-static-copy'

export interface Features {
  buildTool?: 'npm' | 'pnpm' | 'yarn'
  lang?: 'ts' | 'js'
  entryRoot?: string
  entry?: string | string[]
  dist?: string
  lib?: {
    enable?: boolean
    fileName?: string
    sourcemap?: boolean
    dts?: {
      enable?: boolean
    }
    copyPackageJsonToDist?: true
    copyNpmIgnoreToDist?: true
    name?: string
    formats?: LibraryFormats[]
    externals?: (string | RegExp)[]
  }
}

export interface BasicConfig extends UserConfig {
  features?: Features
  pushFeatures?: Features
}

type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: NonNullable<DeepRequired<T[P]>>
    }
  : T

export type ManifestConfig = DeepRequired<BasicConfig>

function withDefaults(cfg: BasicConfig): ManifestConfig {
  const f = cfg.features
  if (f) {
    f.buildTool ??= 'npm'
    f.lang ??= 'js'

    f.entry ??= [`index`]
    if (!Array.isArray(f.entry)) f.entry = [f.entry]

    f.dist ??= 'dist'
    cfg.build = {outDir: f.dist}

    f.entryRoot ??= 'src'
  }
  if (f?.lib) f.lib.enable = true

  if (f?.lib?.enable) {
    f.lib.externals ??= Externals
    f.lib.fileName ??= '[name]'
    f.lib.copyNpmIgnoreToDist ??= true
    f.lib.copyPackageJsonToDist ??= true
    f.lib.sourcemap ??= false
    f.lib.formats ??= ['es']

    if (f.lang === 'ts') f.lib.dts ??= {enable: true}
  }

  const p = cfg.pushFeatures
  if (p && f) {
    if (p.lib?.externals) f.lib?.externals?.push(...p.lib.externals)
    if (p.lib?.formats) f.lib?.formats?.push(...p.lib.formats)

    if (p.entry) {
      const e = Array.isArray(p.entry) ? p.entry : [p.entry]
      f.entry = [...(f.entry as string[]), ...e]
    }
  }

  if (f && Array.isArray(f.entry)) f.entry = f.entry.map(e => `${f.entryRoot}/${e}.${f.lang}`)

  return {...cfg, features: f, pushFeatures: p} as unknown as ManifestConfig
}

export const manifest = (cfg?: BasicConfig) => {
  const rqCfg = withDefaults(cfg!)
  const destConfig = {} as UserConfig

  destConfig.plugins = []
  destConfig.build = {outDir: rqCfg.features.dist}

  const buildConfigLib = () => _BuildConfigLib(rqCfg, destConfig)

  const dtsPlugin = () => {
    const p = _DtsPlugin(rqCfg)
    destConfig.plugins?.push(p)
    return p
  }
  if (rqCfg.features?.lib?.dts?.enable) dtsPlugin()

  const staticCopyPluginPackageJson = () => {
    return StaticCopyPluginLib(rqCfg)
  }

  function defineConfig(userConfig: UserConfig = {}): UserConfig {
    const cfg = mergeConfig(destConfig, userConfig)
    return viteDefineConfig(cfg)
  }

  return {
    buildConfigLib,
    dtsPlugin,
    staticCopyPluginPackageJson,

    defineConfig
  }
}
