import type { DtsConfigOptions } from '@/types'
import type { Plugin } from 'vite'
import type { PluginOptions } from 'vite-plugin-dts'

import * as dts from 'vite-plugin-dts'

interface DtsPluginOptions extends DtsConfigOptions {
  entryRoot?: string
  entry?: string[]
  outDir?: string
  excludes?: string[]
}

export const defaultDtsCfg: DtsPluginOptions = {
  entry: ['index.ts'],
  entryRoot: 'src',
  outDir: 'dist',
}

export function DtsPlugin(options: DtsPluginOptions = defaultDtsCfg): Plugin {
  const includes = options?.entry?.map((e) => `${options.entryRoot}/${e}`)?.filter(Boolean) ?? []
  if (includes.length === 0) {
    throw new Error('entry is required')
  }
  if (options.entryRoot === void 0) {
    throw new Error('entryRoot is required')
  }
  if (options.outDir === void 0) {
    throw new Error('outDir is required')
  }

  const dtsPluginConfig = {
    clearPureImport: true,
    staticImport: true,
    entryRoot: options.entryRoot,
    compilerOptions: {
      declaration: true,
      declarationOnly: true,
      emitDecoratorMetadata: true,
      declarationMap: true,
      declarationDir: options.outDir,
    },
    strictOutput: true,
    include: includes,
    exclude: [`${options.outDir}`, `${options.outDir}/*`, `${options.outDir}/**`, ...options.excludes ?? []],
  } satisfies PluginOptions
  return dts.default(dtsPluginConfig)
}
