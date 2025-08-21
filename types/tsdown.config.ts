import { defineConfig } from 'tsdown'

const _default_1: import('tsdown').UserConfig & import('tsdown').UserConfigFn = defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  sourcemap: true,
  unbundle: true,
  format: ['esm'],
  exports: {
    all: false,
  },
  dts: {
    sourcemap: true,
    isolatedDeclarations: true,
    tsconfig: './tsconfig.node.json',
  },
})
export default _default_1
