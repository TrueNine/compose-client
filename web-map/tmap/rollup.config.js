import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import {defineConfig} from 'rollup'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import tserver from '@rollup/plugin-terser'

export default defineConfig([
  {
    preserveModules: false,
    input: 'src/index.ts',
    output: [
      {
        dir: 'es',
        format: 'esm',
        entryFileNames: '[name].mjs'
      },
      {
        dir: 'lib',
        format: 'cjs',
        entryFileNames: '[name].cjs'
      }
    ],
    plugins: [
      del({
        targets: ['es/*', 'lib/*']
      }),
      resolve(),
      commonjs(),
      typescript(),
      tserver({
        ecma: 2016,
        ie8: false
      })
    ],
    external: ['@compose/api-model']
  },
  {
    preserveModules: false,
    input: 'src/index.ts',
    plugins: [dts()],
    output: [
      {
        dir: 'es'
      },
      {
        dir: 'lib'
      }
    ]
  }
])