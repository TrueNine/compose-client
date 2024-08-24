import {manifest} from './src'

const {defineConfig, buildConfigLib, staticCopyPluginPackageJson} = manifest({
  features: {
    entry: ['index', 'vite-plugin-dts/index', 'vite-plugin-static-copy/index', 'externals/index', 'build-lib-config/index'],
    lang: 'ts',
    lib: {
      sourcemap: false
    }
  }
})

export default defineConfig({
  build: buildConfigLib(),
  plugins: [staticCopyPluginPackageJson()]
})
