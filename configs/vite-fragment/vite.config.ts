import {manifest} from './src'

const {defineConfig} = manifest({
  features: {
    entry: [
      'index',
      'types/index',
      'vite-plugin-dts/index',
      'vite-plugin-static-copy/index',
      'externals/index',
      'excludes/index',
      'build-lib-config/index',
      'rollup-plugin-terser/index'
    ],
    lang: 'ts',
    lib: {
      minify: true,
      minifyUnsafe: false,
      sourcemap: false
    }
  }
})

export default defineConfig({})
