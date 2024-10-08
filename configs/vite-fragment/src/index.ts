import type {UserConfig} from 'vite'
import {defineConfig as viteDefineConfig, mergeConfig} from 'vite'
import type {Options as RollupPluginTerserOptions} from '@rollup/plugin-terser'

import {BuildConfigLib as _BuildConfigLib} from './build-lib-config'
import {DtsPlugin as _DtsPlugin} from './vite-plugin-dts'
import {Externals} from './externals'
import {StaticCopyPlugin} from './vite-plugin-static-copy'
import {Excludes} from './excludes'
import type {BasicConfig, ManifestConfig} from './types'
import {RollupPluginTerser, RollupPluginTerserDefaultOptions} from './rollup-plugin-terser'

function withDefaults(cfg: BasicConfig = {}): ManifestConfig {
  if (!cfg.features) cfg.features = {}
  if (!cfg.pushFeatures) cfg.pushFeatures = {}
  const f = cfg.features
  if (f) {
    f.buildTool ??= 'npm'
    f.lang ??= 'ts'
    f.entry ??= [`index`]
    if (!Array.isArray(f.entry)) f.entry = [f.entry]
    f.exclude ??= Excludes
    f.dist ??= 'dist'
    cfg.build = {outDir: f.dist}

    f.entryRoot ??= 'src'
    if (!f.alias) {
      f.alias = {
        '@': `${f.entryRoot}`
      }
    }
  }
  if (!f.lib) f.lib = {enable: false}
  if (f?.lib && f.lib.enable === void 0) f.lib.enable = true

  f.lib!.copyPackageJsonToDist ??= f.lib.enable ?? false
  f.lib!.copyReadmeToDist ??= false
  f.lib!.copySourceCodeToDist ??= false

  if (f?.lib?.enable) {
    f.lib.externals ??= Externals
    f.lib.fileName ??= '[name]'
    f.lib.sourcemap ??= false
    f.lib.formats ??= ['es']
    f.lib.minify ??= false
    f.lib.minifyUnsafe ??= false
    f.lib.terserOptions ??= RollupPluginTerserDefaultOptions({features: {lib: {minifyUnsafe: f.lib.minifyUnsafe}}} as any) as any

    if (f.lang === 'ts') {
      f.lib.dts ??= {enable: true}
      f.lib.dts.dtsSourcemap ??= f.lib.sourcemap ?? false
      f.lib.dts.dtsSourcemapMetadata ??= f.lib.sourcemap ?? false
    } else {
      f.lib.dts = {
        enable: false,
        dtsSourcemap: false,
        dtsSourcemapMetadata: false
      }
    }
  }

  const p = cfg.pushFeatures
  if (p && f) {
    if (p.lib?.externals) f.lib?.externals?.push(...p.lib.externals)
    if (p.lib?.formats) f.lib?.formats?.push(...p.lib.formats)

    if (p.entry) {
      const e = Array.isArray(p.entry) ? p.entry : [p.entry]
      f.entry = [...(f.entry as string[]), ...e]
      f.entryDirs = f.entry.map(e => e.split('/').slice(0, -1).join('/')!)
    }
    if (p.exclude) f.exclude = [...f.exclude!, ...p.exclude]
  }

  if (f && Array.isArray(f.entry)) {
    f.entry = f.entry.map(e => `${f.entryRoot}/${e}.${f.lang}`)
    f.entryDirs = f.entry.map(e => e.split('/').slice(0, -1).join('/')!)
  }

  return {...cfg, features: f, pushFeatures: p} as unknown as ManifestConfig
}

export const manifest = (cfg?: BasicConfig) => {
  let rqCfg = withDefaults(cfg ?? {})
  rqCfg.plugins = rqCfg.plugins ?? []
  rqCfg.build = mergeConfig(rqCfg.build ?? {}, {outDir: rqCfg.features.dist}) as any

  const buildConfigLib = () => {
    return _BuildConfigLib(rqCfg)
  }

  const dtsPlugin = () => {
    return _DtsPlugin(rqCfg)
  }

  const staticCopyPluginPackageJson = () => {
    return StaticCopyPlugin(rqCfg)
  }

  function defineConfig(userConfig: UserConfig = {}): UserConfig {
    rqCfg = mergeConfig(userConfig, rqCfg) as ManifestConfig

    if (rqCfg.features?.lib?.enable) {
      rqCfg.build = buildConfigLib() as any
      //const newResolve = ResolveAliasConfig(rqCfg)
      //rqCfg.resolve = mergeConfig(rqCfg.resolve, newResolve.resolve) as any
    }

    if (rqCfg.features?.lib?.dts?.enable) rqCfg.plugins.push(dtsPlugin())

    if (rqCfg.features?.lib?.minify)
      rqCfg.build = mergeConfig(rqCfg.build, {
        rollupOptions: {
          plugins: rollupPluginTerser(rqCfg.features.lib.terserOptions as unknown as RollupPluginTerserOptions)
        }
      }) as any
    if (rqCfg.features.lib.copyPackageJsonToDist || rqCfg.features.lib.sourcemap) {
      rqCfg.plugins.push(staticCopyPluginPackageJson())
    }
    const vite = viteDefineConfig(rqCfg as unknown as UserConfig)
    console.log(vite)
    return vite
  }

  function rollupPluginTerser(options?: RollupPluginTerserOptions) {
    return RollupPluginTerser(rqCfg, options ?? {})
  }

  return {
    buildConfigLib,
    dtsPlugin,
    staticCopyPluginPackageJson,

    rollupPluginTerser,

    defineConfig
  }
}
