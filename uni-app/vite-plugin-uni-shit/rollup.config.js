import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import {defineConfig} from 'rollup'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import tserver from '@rollup/plugin-terser'
import resolverJson from '@rollup/plugin-json'

export default defineConfig([
  {
    preserveModules: false,
    input: ['src/index.ts'],
    external: ['node', 'fs', 'path', 'process'],
    output: {
      dir: 'es',
      format: 'commonjs'
    },
    plugins: [
      del({
        targets: ['es/*']
      }),
      resolverJson(),
      resolve(),
      commonjs(),
      typescript(),
      tserver({
        ecma: 2016,
        ie8: false
      })
    ]
  },
  {
    input: 'src/index.ts',
    plugins: [dts({})],
    output: {
      format: 'es',
      file: 'es/index.d.ts'
    }
  }
])
