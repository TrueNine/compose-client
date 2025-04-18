import type { BuildOptions } from 'vite'
import type { BuildLibraryConfigOptions } from '../types'

import { Externals } from '../externals'

export function BuildConfigLib(options: BuildLibraryConfigOptions = {}): BuildOptions {
  const {
    entry = ['./src/index.ts'],
    entryRoot = 'src',
    outDir = 'dist',
    formats = ['es'],
    sourcemap = false,
    name = 'index',
    externals = Externals,
  } = options

  return {
    reportCompressedSize: false,
    sourcemap,
    outDir,
    emptyOutDir: true,
    minify: false,
    lib: {
      entry,
      formats,
      name,
      fileName: '[name]',
    },
    rollupOptions: {
      external: externals,
      output: {
        preserveModulesRoot: entryRoot,
        preserveModules: true,
        compact: false,
        minifyInternalExports: false,
      },
    },
  }
}
