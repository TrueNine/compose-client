import { EslintExternals } from './EslintExternals'
import { NodeExternals } from './NodeExternals'
import { TypescriptExternals } from './TypescriptExternals'
import { ViteExternals } from './ViteExternals'

export * from './EslintExternals'
export * from './NodeExternals'

export const Externals = [
  // 既定依赖
  /__tests__/,
  /__test__/,
  /__build-src__/,

  // compose
  /^@truenine/,

  // vue
  /^vue/,
  /^@vue/,
  /^@vueuse/,
  /^vue-router/,
  /^pinia/,

  /^vee-validate/,
  /^yup/,

  // 组件库
  /^element-plus/,
  /^element-ui/,
  /^quasar/,
  /^@quasar/,
  /^vuetify/,
  /^@varlet/,
  /^naive-ui/,

  // date class
  /^dayjs/,
  /^moment/,
  /^@date-io/,

  // code
  /^highlight\.js/,

  // rollup
  /^(@rollup|rollup)/,

  // tools
  /^lodash-es/,
  /^pdfjs-dist/,
  /^pino/,
  /^@antfu/,
  /^@antfu\/ni/,
  /^libarchive\.js/,

  // 样式文件
  /\.(scss|sass|less|css)$/,

  ...NodeExternals,
  ...ViteExternals,
  ...TypescriptExternals,
  ...EslintExternals,

  // other
  /^data:/,
  // unocss
  /^(unocss|@unocss)/,
]
