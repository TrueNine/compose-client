import {recommendedRollupConfig} from '@compose/rollup-pack-config'

export default recommendedRollupConfig({
  externals: ['lodash-es/cloneDeep'],
  globals: {
    'lodash-es/cloneDeep': '$Lodash'
  },
  umd: {
    globalVarName: '$model',
    fileName: 'compose-types-api-model'
  }
})
