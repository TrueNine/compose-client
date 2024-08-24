import {fileURLToPath, URL} from 'node:url'

import {manifest} from '@compose/config-vite-fragment'

const {defineConfig, buildConfigLib, dtsPlugin, staticCopyPluginPackageJson} = manifest({
  features: {
    lang: 'ts',
    lib: {
      sourcemap: false
    }
  }
})

export default defineConfig({
  build: buildConfigLib(),
  plugins: [dtsPlugin(), staticCopyPluginPackageJson()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
