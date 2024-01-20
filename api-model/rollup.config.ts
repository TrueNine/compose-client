import {defineConfig} from 'rollup'
import ts from '@rollup/plugin-typescript'
import res from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import {emptyDirSync} from 'fs-extra'

export default defineConfig([
  {
    input: 'index.ts',
    plugins: [
      {
        name: 'generate-types',
        buildStart: () => {
          emptyDirSync('dist')
          console.log('清理 dist')
        }
      },
      res(),
      cjs(),
      ts({
        tsconfig: './tsconfig.json',
        exclude: ['__tests__/**', 'rollup.config.ts', 'vite.config.ts', 'vitest.config.ts', 'dist']
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
    external: ['vue', 'tsLib', 'vue-router', /(@compose|@compose\/)/, 'api-types', /(lodash|lodash\/)/, /(dayjs|dayjs\/)/]
  },
  {
    input: 'index.ts',
    plugins: [
      res(),
      cjs(),
      ts({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          declaration: true,
          declarationMap: true,
          emitDeclarationOnly: true,
          declarationDir: 'dist'
        },
        exclude: ['__tests__/**', 'rollup.config.ts', 'vite.config.ts', 'vitest.config.ts', 'dist']
      })
    ],
    output: [
      {
        dir: 'dist'
      }
    ]
  }
])
