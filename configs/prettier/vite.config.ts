import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'

const {defineConfig} = manifest({
  features: {
    lang: 'ts',
    lib: {
      minify: true,
      formats: ['es', 'cjs'],
      sourcemap: false
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
