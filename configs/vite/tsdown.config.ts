import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/vite-plugin-dts/index.ts',
    './src/vite-plugin-package-json/index.ts',
    './src/externals/index.ts',
    './src/excludes/index.ts',
    './src/lib/index.ts',
  ],
  platform: 'node',
  sourcemap: true,
  unbundle: true,
  format: ['cjs', 'esm'],
  exports: {
    all: false,
  },
  dts: {
    sourcemap: true,
    isolatedDeclarations: true,
  },
})
