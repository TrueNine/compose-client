import dts from 'vite-plugin-dts'
import type {Plugin} from 'vite'

import type {ManifestConfig} from '../types'

export const DtsPlugin = (dtsCfg: ManifestConfig): Plugin => {
  const includes = dtsCfg.features.entryDirs.map(dir => `${dir}/**`)
  includes.push('env.d.ts')
  const cfg = {
    clearPureImport: false,
    staticImport: false,
    entryRoot: dtsCfg.features.entryRoot,
    compilerOptions: {
      declaration: dtsCfg.features.lib.dts.enable,
      declarationOnly: dtsCfg.features.lib.dts.enable,
      emitDecoratorMetadata: dtsCfg.features.lib.dts.enable,
      declarationMap: dtsCfg.features.lib.sourcemap,
      declarationDir: dtsCfg.build.outDir
    },
    strictOutput: true,
    include: includes,
    exclude: [`${dtsCfg.build.outDir}`, `${dtsCfg.build.outDir}/*`, `${dtsCfg.build.outDir}/**`, ...dtsCfg.features.exclude]
  }
  console.log('dts cfg', cfg)
  console.log('dts cfg json', JSON.stringify(cfg, null, 4))
  return dts(cfg)
}
