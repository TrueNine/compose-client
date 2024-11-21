import {manifest} from './src'
import {fileURLToPath, URL} from 'node:url'

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
    lib: {
      minify: true,
      minifyUnsafe: true,
      sourcemap: false
    }
  }
})
const d = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
console.log(d)
export default d
