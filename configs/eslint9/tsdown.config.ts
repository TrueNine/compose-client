import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'node',
  sourcemap: true,
  unbundle: true,
  format: ['cjs', 'esm'],
  exports: {
    all: false,
  },
  dts: {
    sourcemap: true,

    tsconfig: './tsconfig.build.json',
  },
})
