import {recommendedRollupConfig} from '@compose/rollup-pack-config'

export default recommendedRollupConfig({
  externals: ['unocss'],
  umd: {globalVarName: '$uno', fileName: 'compose-types-uno-css'}
})
