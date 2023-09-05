import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import jsonResolve from '@rollup/plugin-json'
import {defineConfig} from 'rollup'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import copy from 'rollup-plugin-copy'

export default defineConfig([
  {
    external: [
      'rollup',
      '@rollup/plugin-terser',
      '@rollup/plugin-node-resolve',
      '@rollup/plugin-commonjs',
      '@rollup/plugin-typescript',
      '@rollup/plugin-json',
      'rollup-plugin-dts',
      'rollup-plugin-delete',
      'rollup-plugin-copy',
      'tslib'
    ],
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
      jsonResolve(),
      commonjs(),
      typescript(),
      terser({
        ecma: 2020
      }),
      copy({
        targets: [
          {
            src: 'src/modules.d.ts',
            dest: 'types'
          }
        ]
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
