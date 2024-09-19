import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'

const {defineConfig} = manifest({
  features: {
    lib: {
      enable: true,
      sourcemap: true,
      formats: ['es', 'cjs']
    }
  }
})

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
