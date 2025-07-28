import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/browser/document.ts',
    './src/lodash-es/index.ts',
    './src/dayjs/index.ts',
    './src/libarchive-js/index.ts',
    './src/pdfjs-dist/index.ts',
    './src/vue/index.ts',
    './src/vue-router/index.ts',
  ],
  platform: 'neutral',
  sourcemap: true,
  unbundle: true,
  format: ['esm'],
  dts: {
    sourcemap: true,
    isolatedDeclarations: true,
  },
})
