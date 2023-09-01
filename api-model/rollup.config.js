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
        dir: 'es',
        preserveModulesRoot: 'src',
        preserveModules: true,
        format: 'esm',
        entryFileNames: '[name].mjs'
      },
      {
        dir: 'lib',
        preserveModulesRoot: 'src',
        preserveModules: true,
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
        ecma: 2020,
        ie8: false
      })
    ],
    external: ['moment', '@vueuse/core', 'vue', 'tslib']
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
