export const Externals = [
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

  /^(fs-extra|fs-extra\/)/,
  /^(fsevents|fsevents\/)/,
  /^(vite:|vite:\/|vite$)/,
  /^(vite-plugin-static-copy|vite-plugin-static-copy\/)/,
  /^(vite-plugin-dts|vite-plugin-dts\/)/,

  /^(node|node\/|node:)/,
  // rollup
  '@rollup/plugin-terser',

  // tools
  /^(lodash-es|lodash-es\/)/,
  /^(pdfjs-dist|pdfjs-dist\/)/,
  /^(libarchive\.js|libarchive\.js\/)/,

  // 样式文件
  /\.(scss|sass|less|css)$/,

  // eslint
  '@rushstack/eslint-patch/modern-module-resolution',
  '@typescript-eslint/parser',
  'eslint-define-config'
]
