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
      formats: ['es', 'cjs'],
      minify: false,
      sourcemap: true
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
export default d
