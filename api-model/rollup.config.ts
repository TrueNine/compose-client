import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'rollup'
import ts from '@rollup/plugin-typescript'
import cjs from '@rollup/plugin-commonjs'
import res from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import {emptyDirSync} from 'fs-extra'

export default defineConfig([
  {
    input: ['src/index.ts', 'src/tools/index.ts', 'src/consts/index.ts', 'src/data/index.ts', 'src/pageable/index.ts'],
    plugins: [
      {
        name: 'generate-types',
        buildStart: () => {
          emptyDirSync('dist')
        }
      },
      res(),
      cjs(),
      alias({
        entries: [{find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url))}]
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          unused: true
        }
      }),
      ts({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          declaration: true,
          noEmit: true,
          declarationMap: false,
          emitDeclarationOnly: true,
          declarationDir: 'dist'
        },
        exclude: ['__tests__/**', 'rollup.config.ts', 'vite.config.ts', 'vitest.config.ts', 'dist']
      })
    ],
    output: [
      {
        sourcemap: false,
        preserveModulesRoot: 'src',
        preserveModules: true,
        format: 'esm',
        dir: 'dist'
      }
    ],
    external: ['vue', 'pdfjs-dist', 'tsLib', 'vue-router', /(@compose|@compose\/)/, 'api-types', /(lodash|lodash\/)/, /(dayjs|dayjs\/)/]
  }
])
