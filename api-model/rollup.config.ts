import {recommendedRollupConfig} from '@compose/rollup-pack-config'

export default recommendedRollupConfig({
  umd: {
    globalVarName: '$model',
    fileName: 'compose-types-api-model'
  }
})
