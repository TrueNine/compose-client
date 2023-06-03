import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import {defineConfig} from 'rollup'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import tserver from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'

export default defineConfig([
  {
    preserveModules: false,
    input: 'src/index.ts',
    output: {
      dir: 'es',
      format: 'esm'
    },
    plugins: [
      del({
        targets: ['es/*']
      }),
      copy({
        targets: [{src: 'src/GlobalBase.d.ts', dest: 'es'}]
      }),
      resolve(),
      commonjs(),
      typescript(),
      tserver({
        ecma: 2016,
        ie8: false
      })
    ],
    external: ['@compose/api-model', '@compose/uni-mp-adk']
  },
  {
    preserveModules: false,
    input: 'src/index.ts',
    external: ['vue'],
    plugins: [dts()],
    output: {
      format: 'es',
      dir: 'es'
    }
  }
])
