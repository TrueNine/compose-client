import {defineConfig} from 'rollup'
import ts from '@rollup/plugin-typescript'
import res from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

export default defineConfig([
  {
    input: 'index.ts',
    plugins: [
      del({
        targets: ['dist/**.d.ts', 'dist/**']
      }),
      res(),
      cjs(),
      ts({
        tsconfig: './tsconfig.json',
        exclude: ['./__test__/**', 'rollup.config.ts', 'vite.config.ts', 'vitest.config.ts']
      })
    ],
    output: [
      {
        sourcemap: true,
        entryFileNames: '[name].js',
        preserveModulesRoot: '.',
        preserveModules: true,
        format: 'es',
        dir: 'dist'
      },
      {
        sourcemap: true,
        entryFileNames: '[name].cjs',
        preserveModulesRoot: '.',
        preserveModules: true,
        format: 'cjs',
        dir: 'dist'
      }
    ],
    external: ['@compose/api-model', 'vue', 'tsLib', 'vue-router', '@compose/compose-types', 'compose-types', 'lodash-es/cloneDeep']
  },
  {
    input: 'index.ts',
    plugins: [dts()],
    output: {
      dir: 'dist',
      preserveModules: true
    }
  }
])
