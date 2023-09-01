import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import {defineConfig} from 'rollup'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'

export default defineConfig([
  {
    input: 'src/index.ts',
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
      resolve(),
      commonjs(),
      typescript(),
      terser({
        ecma: 2016,
        ie8: false
      })
    ],
    external: ['@compose/api-model']
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
