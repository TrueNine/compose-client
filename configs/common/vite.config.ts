import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'

const {defineConfig} = manifest({
  features: {
    lib: {
      formats: ['es', 'cjs'],
      sourcemap: true,
      dts: {
        enable: true,
        dtsSourcemap: true
      }
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
