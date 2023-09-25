import {defineConfig} from 'rollup'
import {recommendedRollupConfig} from '@compose/rollup-pack-config'

export default defineConfig(
  recommendedRollupConfig({
    externals: ['unocss'],
    umd: {globalVarName: '$uno', fileName: 'compose-types-uno-css'}
  })
)
