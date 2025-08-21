import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  sourcemap: true,
  unbundle: true,
  format: ['esm'],
  exports: {
    all: false,
  },
  tsconfig: './tsconfig.lib.json',
  dts: {
    sourcemap: true,
    isolatedDeclarations: true,
  },
})
