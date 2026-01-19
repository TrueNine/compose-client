import type {BuildOptions} from 'vite'
import type {BuildLibraryConfigOptions} from '../types'

import {Externals} from '../externals'

export function BuildConfigLib(options: BuildLibraryConfigOptions = {}): BuildOptions {
  const {
    minify = false,
    entry = ['./src/index.ts'],
    entryRoot = 'src',
    outDir = 'dist',
    formats = ['es'],
    sourcemap = false,
    name = 'index',
    externals = Externals,
    fileNameMap = {es: '.mjs', cjs: '.cjs', umd: '.umd.js', iife: '.iife.js'}
  } = options

  return {
    reportCompressedSize: false,
    sourcemap,
    outDir,
    emptyOutDir: true,
    minify,
    lib: {entry, formats, name, fileName: (format: string) => `[name]${fileNameMap[format as keyof typeof fileNameMap]}`},
    assetsInlineLimit: 0,
    rollupOptions: {external: externals, output: {preserveModulesRoot: entryRoot, preserveModules: true, compact: minify, minifyInternalExports: minify}}
  }
}
