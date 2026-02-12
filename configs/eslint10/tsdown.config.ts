import {defineConfig} from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*', '!**/*.{spec,test}.*', '!**/*.md'],
  platform: 'node',
  sourcemap: true,
  unbundle: true,
  format: ['esm', 'cjs'],
  dts: {sourcemap: true, tsconfig: './tsconfig.lib.json'}
})
