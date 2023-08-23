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
    input: ['src/index.ts'],
    external: ['node', 'fs', 'path', 'process'],
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
