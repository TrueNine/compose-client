import { fileURLToPath, URL } from 'node:url'

import { manifest } from '@compose/config-vite-fragment'

const { defineConfig } = manifest({
  features: {
    lib: {
      enable: true,
      minify: true,
      sourcemap: true,
      dts: {
        enable: true,
        dtsSourcemap: true,
      },
    },
    entry: ['index', 'browser/document', 'lodash-es/index', 'dayjs/index', 'libarchive-js/index', 'pdfjs-dist/index', 'vue/index', 'pino/index'],
  },
})

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
