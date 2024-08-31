import {defineConfig} from 'rollup'
import type {Plugin} from 'rollup'
import ts from '@rollup/plugin-typescript'
import cjs from '@rollup/plugin-commonjs'
import res from '@rollup/plugin-node-resolve'
//import alias from '@rollup/plugin-alias'
//import {emptyDirSync} from 'fs-extra'

const customExternalPlugin = async (): Promise<Plugin> => {
  return {
    name: 'custom-external-plugin',
    generateBundle: (_, bundle) => {
      Object.keys(bundle).forEach(key => {
        if (key.startsWith('consts/Strings')) delete bundle[key]
        else if (key.startsWith('tools/Strings')) delete bundle[key]
      })
    }
  }
}

export default defineConfig([
  {
    input: ['src/references/VueRouter.ts'],
    plugins: [res(), cjs(), ts(), customExternalPlugin()],
    output: [
      {
        sourcemap: true,
        preserveModulesRoot: 'src',
        preserveModules: true,
        format: 'esm',
        dir: 'dist'
      }
    ]
  }
])
