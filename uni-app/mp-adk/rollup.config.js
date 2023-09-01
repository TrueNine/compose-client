import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import {defineConfig} from 'rollup'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import tserver from '@rollup/plugin-terser'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'es',
        format: 'esm',
        entryFileNames: '[name].mjs'
      },
      {
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'lib',
        format: 'cjs',
        entryFileNames: '[name].cjs'
      }
    ],
    plugins: [
      del({
        targets: ['es/*', 'lib/*', 'types/*']
      }),
      resolve(),
      commonjs(),
      typescript(),
      tserver({
        ecma: 2020
      })
    ],
    external: ['vue', '@vue/runtime-core', '@compose/api-model']
  },
  {
    input: 'src/index.ts',
    external: ['vue'],
    plugins: [dts()],
    output: [
      {
        preserveModules: true,
        dir: 'types'
      }
    ]
  }
])
