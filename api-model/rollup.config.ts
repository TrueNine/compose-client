import {recommendedRollupConfig} from '@compose/rollup-pack-config'

export default recommendedRollupConfig({
  externals: ['lodash-es/cloneDeep'],
  enableUmd: false
})
