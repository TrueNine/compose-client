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
    external: ['node', 'fs', 'path', 'process', 'tslib'],
    output: [
      {
        preserveModulesRoot: 'src',
        preserveModules: true,
        dir: 'es',
        format: 'esm',
        entryFileNames: '[name].mjs'
      },
      {
        preserveModulesRoot: 'src',
        preserveModules: true,
        dir: 'lib',
        format: 'cjs',
        entryFileNames: '[name].cjs'
      }
    ],
    plugins: [
      del({
        targets: ['es/*', 'lib/*', 'types/*']
      }),
      resolverJson(),
      resolve(),
      commonjs(),
      typescript(),
      tserver({
        ecma: 2020
      })
    ]
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: [
      {
        preserveModules: true,
        dir: 'types'
      }
    ]
  }
])
