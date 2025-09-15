import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*', '!**/*.{spec,test}.*'],
  platform: 'node',
  sourcemap: true,
  unbundle: true,
  format: ['cjs'],
  dts: {
    sourcemap: true,
    tsconfig: './tsconfig.lib.json',
  },
})
