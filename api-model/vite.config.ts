import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'

const {defineConfig} = manifest({
  pushFeatures: {
    lib: {
      externals: [/(\/VueRouter$)/]
    }
  },
  features: {
    entry: ['index', 'consts/index', 'data/index', 'tools/index', 'defineds/index'],
    lib: {
      minify: true,
      sourcemap: true,
      dts: {
        enable: true,
        dtsSourcemap: true
      },
      copySourceCodeToDist: false
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
