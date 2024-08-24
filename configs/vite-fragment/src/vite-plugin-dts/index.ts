import dts from 'vite-plugin-dts'
import type {Plugin, UserConfig} from 'vite'

import type {ManifestConfig} from '../index'

export const DtsPlugin = (dtsCfg: ManifestConfig, other?: UserConfig): Plugin => {
  const cfg = {
    tsconfigPath: './tsconfig.json',
    clearPureImport: true,
    staticImport: true,
    entryRoot: dtsCfg.features.entryRoot,
    compilerOptions: {
      declaration: dtsCfg.features.lib.dts.enable,
      declarationMap: dtsCfg.features.lib.sourcemap,
      declarationDir: dtsCfg.build.outDir
    },
    strictOutput: true,
    exclude: [
      'uno.config.**',
      `${dtsCfg.build.outDir}/**`,
      '__build-src__/**',
      'vite.config.**',
      '**/__tests__/**',
      '**/__tests__/**',
      'vitest.config.**',
      'playground'
    ]
  }

  return dts(cfg)
}
