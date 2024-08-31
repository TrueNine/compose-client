import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'

const {defineConfig} = manifest({
  features: {
    lib: {enable: true},
    entry: ['index', 'browser/index', 'lodash-es/index', 'dayjs/index', 'libarchive-js/index', 'pdfjs-dist/index', 'vue/index']
  }
})

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
