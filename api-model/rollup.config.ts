import {defineConfig} from 'rollup'
import {recommendedRollupConfig} from '@compose/rollup-pack-config'

export default defineConfig(
  recommendedRollupConfig({
    umd: {globalVarName: '$model', fileName: 'compose-api-model'}
  })
)
