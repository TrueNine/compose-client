import {NodeExternals} from './NodeExternals'
import {ViteExternals} from './ViteExternals'

export * from './NodeExternals'
export * from './EslintExternals'

export const Externals = [
  // 既定依赖
  /(__tests__|__tests__\/)/,
  /(__test__|__test__\/)/,
  /(__build-src__|__build-src__\/)/,

  // compose
  /^(@compose|@compose\/)/,

  // vue
  /^(vue|vue\/)/,
  /^(@vue|@vue\/)/,
  /^(@vueuse|@vueuse\/)/,
  /^(vue-router|vue-router\/)/,
  /^(pinia|pinia\/)/,

  /^(vee-validate|vee-validate\/)/,
  /^(yup|yup\/)/,

  // 组件库
  /^(element-plus|element-plus\/)/,
  /^(element-ui|element-ui\/)/,
  /^(quasar|quasar\/)/,
  /^(@quasar|@quasar\/)/,
  /^(vuetify|vuetify\/)/,
  /^(@varlet|@varlet\/)/,
  /^(naive-ui|naive-ui\/)/,

  // date class
  /^(dayjs|dayjs\/)/,
  /^(moment|moment\/)/,
  /^(@date-io|@date-io\/)/,

  // code
  /^(highlight\.js|highlight\.js\/)/,

  // rollup
  /^(rollup|rollup\/|@rollup|@rollup\/|rollup-|rollup-plugin-)/,

  // tools
  /^(lodash-es|lodash-es\/)/,
  /^(pdfjs-dist|pdfjs-dist\/)/,
  /^(pino|pino\/)/,
  /^(@antfu|@antfu\/)/,
  /^(@antfu\/ni|@antfu\/ni\/)/,
  /^(libarchive\.js|libarchive\.js\/)/,

  // 样式文件
  /\.(scss|sass|less|css)$/,

  ...NodeExternals,
  ...ViteExternals,

  // other
  /^(data:)/,
  // unocss
  /^(unocss|unocss\/|unocss-|unocss-\/|@unocss|@unocss\/)/
]
