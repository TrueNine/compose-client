import type {UserConfig} from 'vite'
import {defineConfig as viteDefineConfig, mergeConfig} from 'vite'
import type {Options as RollupPluginTerserOptions} from '@rollup/plugin-terser'

import {BuildConfigLib as _BuildConfigLib} from './build-lib-config'
import {DtsPlugin as _DtsPlugin} from './vite-plugin-dts'
import {Externals} from './externals'
import {StaticCopyPluginLib} from './vite-plugin-static-copy'
import {Excludes} from './excludes'
import type {BasicConfig, ManifestConfig} from './types'
import {RollupPluginTerser, RollupPluginTerserDefaultOptions} from './rollup-plugin-terser'

function withDefaults(cfg: BasicConfig = {}): ManifestConfig {
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
  }
  if (f?.lib) f.lib.enable = true

  if (f?.lib?.enable) {
    f.lib.externals ??= Externals
    f.lib.fileName ??= '[name]'
    f.lib.copyNpmIgnoreToDist ??= true
    f.lib.copyPackageJsonToDist ??= true
    f.lib.sourcemap ??= false
    f.lib.formats ??= ['es']
    f.lib.minify ??= false
    f.lib.minifyUnsafe ??= false

    f.lib.terserOptions ??= RollupPluginTerserDefaultOptions({features: {lib: {minifyUnsafe: f.lib.minifyUnsafe}}} as any) as any

    if (f.lang === 'ts') f.lib.dts ??= {enable: true}
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
  console.log('rqConfig init', rqCfg)

  rqCfg.plugins = rqCfg.plugins ?? []
  rqCfg.build = mergeConfig(rqCfg.build ?? {}, {outDir: rqCfg.features.dist}) as any
  console.log('rqConfig set default', rqCfg)

  const buildConfigLib = () => {
    const a = _BuildConfigLib(rqCfg)
    console.log('exec build lib config', a)
    return a
  }

  const dtsPlugin = () => {
    console.log('exec dts plugin')
    return _DtsPlugin(rqCfg)
  }

  const staticCopyPluginPackageJson = () => {
    console.log('exec static copy plugin')
    return StaticCopyPluginLib(rqCfg)
  }

  function defineConfig(userConfig: UserConfig = {}): UserConfig {
    rqCfg = mergeConfig(userConfig, rqCfg) as ManifestConfig
    console.log('define config merge config', rqCfg)

    if (rqCfg.features?.lib?.enable) rqCfg.build = buildConfigLib() as any

    if (rqCfg.features?.lib?.dts?.enable) rqCfg.plugins.push(dtsPlugin())

    if (rqCfg.features?.lib?.minify)
      rqCfg.build = mergeConfig(rqCfg.build, {
        rollupOptions: {
          plugins: rollupPluginTerser(rqCfg.features.lib.terserOptions as unknown as RollupPluginTerserOptions)
        }
      }) as any
    if (rqCfg.features.lib.copyPackageJsonToDist) {
      rqCfg.plugins.push(...staticCopyPluginPackageJson())
    }

    const afterDefineConfig = viteDefineConfig(rqCfg as unknown as UserConfig)
    console.log('after define config', afterDefineConfig)
    return afterDefineConfig
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
