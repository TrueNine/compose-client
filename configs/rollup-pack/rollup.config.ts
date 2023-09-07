import {recommendedRollupConfig} from './src'

export default recommendedRollupConfig({
  copy: {
    targets: [{src: 'src/Modules.d.ts', dest: 'dist/types'}]
  },
  globals: {
    vue: 'Vue',
    '@rollup/plugin-terser': '____T'
  }
})
