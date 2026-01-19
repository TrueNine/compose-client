import {defineConfig} from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*', '!**/*.{spec,test}.*'],
  platform: 'node',
  sourcemap: true,
  unbundle: false,
  minify: true,
  format: ['cjs'],
  dts: {sourcemap: true, tsconfig: './tsconfig.lib.json', build: true},
  external: [
    'chrome-launcher', // Only externalize Node.js built-ins and large optional dependencies
    'puppeteer-core'
  ]
})
