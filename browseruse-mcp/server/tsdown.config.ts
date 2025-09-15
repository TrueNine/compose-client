import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*', '!**/*.{spec,test}.*'],
  platform: 'node',
  sourcemap: false,
  unbundle: false,
  minify: true,
  format: ['cjs'],
  dts: false,
  external: [
    // Only externalize Node.js built-ins and large optional dependencies
    'chrome-launcher',
    'puppeteer-core',
  ],
})
