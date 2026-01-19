import {EslintExternals} from './EslintExternals'
import {NodeExternals} from './NodeExternals'
import {TypescriptExternals} from './TypescriptExternals'
import {ViteExternals} from './ViteExternals'

export * from './EslintExternals'
export * from './NodeExternals'

export const Externals: (string | RegExp)[] = [
  /__tests__/, // 既定依赖
  /__test__/,
  /__build-src__/,

  /^@truenine/, // compose

  /^vue/, // vue
  /^@vue/,
  /^@vueuse/,
  /^vue-router/,
  /^pinia/,

  /^vee-validate/,
  /^yup/,

  /^element-plus/, // 组件库
  /^element-ui/,
  /^quasar/,
  /^@quasar/,
  /^vuetify/,
  /^@varlet/,
  /^naive-ui/,

  /^dayjs/, // date class
  /^moment/,
  /^@date-io/,

  /^highlight\.js/, // code

  /^(@rollup|rollup)/, // rollup

  /^lodash-es/, // tools
  /^pdfjs-dist/,
  /^pino/,
  /^@antfu/,
  /^@antfu\/ni/,
  /^libarchive\.js/,

  /\.(scss|sass|less|css)$/, // 样式文件

  ...NodeExternals,
  ...ViteExternals,
  ...TypescriptExternals,
  ...EslintExternals,

  /^data:/, // other
  /^(unocss|@unocss)/ // unocss
]
