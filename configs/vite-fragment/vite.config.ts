import {manifest} from './src'

const {defineConfig} = manifest({
  features: {
    entry: [
      'index',
      'types/index',
      'alias/index',
      'vite-plugin-dts/index',
      'vite-plugin-static-copy/index',
      'externals/index',
      'excludes/index',
      'build-lib-config/index',
      'rollup-plugin-terser/index'
    ],
    lib: {
      minify: true,
      minifyUnsafe: true,
      sourcemap: false
    }
  }
})
const d = defineConfig()
console.log(d)
export default d
