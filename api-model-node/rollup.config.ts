import {recommendedRollupConfig} from '@compose/rollup-pack-config'

export default recommendedRollupConfig({
  enableUmd: false,
  umd: {
    globalVarName: '$nodeModel',
    fileName: 'compose-types-api-model-node'
  }
})
