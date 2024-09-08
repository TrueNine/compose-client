import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'
const {defineConfig} = manifest({
  features: {
    entry: ['index', 'tools/index', 'typings/index', 'types/index'],
    lib: {enable: true}
  }
})

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
