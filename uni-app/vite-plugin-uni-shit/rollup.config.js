const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript')
const {defineConfig} = require('rollup')
const dts = require('rollup-plugin-dts')
const del = require('rollup-plugin-delete')
const tserver = require('@rollup/plugin-terser')
const resolverJson = require('@rollup/plugin-json')
console.log(dts)
module.exports = defineConfig([
  {
    preserveModules: false,
    input: ['src/index.ts'],
    external: ['node', 'fs', 'path', 'process'],
    output: {
      file: 'es/index.cjs',
      format: 'commonjs'
    },
    plugins: [
      del({
        targets: ['es/*']
      }),
      resolverJson(),
      resolve(),
      commonjs(),
      typescript(),
      tserver({
        ecma: 2016,
        ie8: false
      })
    ]
  },
  {
    input: 'src/index.ts',
    plugins: [dts.default({})],
    output: {
      format: 'es',
      file: 'es/index.d.ts'
    }
  }
])
