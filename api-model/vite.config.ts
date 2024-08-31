import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'

console.log(fileURLToPath(new URL('./src', import.meta.url)))

const {defineConfig} = manifest({
  pushFeatures: {
    lib: {
      externals: ['@compose/api-typings', /(__test__|__test__\/)/, /(__tests__|__tests__\/)/, /(\/VueRouter$)/]
    }
  },
  features: {
    entry: ['index', 'consts/index', 'data/index', 'tools/index', 'defineds/index'],
    lib: {
      minify: true,
      sourcemap: true,
      copySourceCodeToDist: true
    }
  }
})

export default defineConfig({
  optimizeDeps: {exclude: ['import.meta']},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
