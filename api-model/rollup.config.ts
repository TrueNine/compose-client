import {defineConfig} from 'rollup'
import ts from '@rollup/plugin-typescript'
import res from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'

export default defineConfig([
  {
    input: 'index.ts',
    plugins: [
      res(),
      cjs(),
      ts({
        tsconfig: './tsconfig.json',
        exclude: ['./__test__/**', 'rollup.config.ts', 'vite.config.ts', 'vitest.config.ts', 'dist']
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
    plugins: [dts({tsconfig: './tsconfig.json'})],
    output: {
      dir: 'dist',
      preserveModules: true
    }
  }
])
