import type {ManifestConfig} from '@/types'
import type {Plugin} from 'vite'
import type {PluginOptions} from 'vite-plugin-dts'

import * as dts from 'vite-plugin-dts'

export function DtsPlugin(dtsCfg: ManifestConfig): Plugin {
  const includes = dtsCfg.features.entryDirs.map(dir => `${dir}/**`)
  includes.push('env.d.ts')
  const cfg = {
    clearPureImport: true,
    staticImport: true,
    entryRoot: dtsCfg.features.entryRoot,
    compilerOptions: {
      declaration: dtsCfg.features.lib.dts.enable,
      declarationOnly: dtsCfg.features.lib.dts.enable,
      emitDecoratorMetadata: dtsCfg.features.lib.dts.dtsSourcemapMetadata,
      declarationMap: dtsCfg.features.lib.dts.dtsSourcemap,
      declarationDir: dtsCfg.build.outDir
    },
    strictOutput: true,
    include: includes,
    exclude: [`${dtsCfg.build.outDir}`, `${dtsCfg.build.outDir}/*`, `${dtsCfg.build.outDir}/**`, ...dtsCfg.features.exclude]
  } as PluginOptions
  return dts.default(cfg)
}
