import type {BuildOptions, UserConfig} from 'vite'
import {mergeConfig} from 'vite'

import type {ManifestConfig} from '../types'

export const BuildConfigLib = (o: ManifestConfig, cfg?: UserConfig): BuildOptions => {
  const f = o.features
  const m: BuildOptions = mergeConfig(
    {
      sourcemap: f.lib.sourcemap,
      outDir: f.dist,
      lib: {
        fileName: f.lib.fileName,
        entry: f.entry,
        formats: f.lib.formats
      },
      rollupOptions: {
        output: {
          preserveModulesRoot: f.entryRoot,
          preserveModules: true
        },
        external: f.lib.externals
      }
    },
    cfg?.build ?? {}
  )
  return m
}
