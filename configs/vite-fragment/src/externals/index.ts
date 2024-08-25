export const Externals = [
  /(vue|vue\/)/,

  /(dayjs|dayjs\/)/,
  /^(vue-router|vue-router\/)/,

  /(fsevents|fsevents\/)/,
  /(vite:|vite:\/)/,
  /^vite$/,

  /(node|node\/|node:)/,
  /(fs-extra|fs-extra\/)/,

  /^(vite-plugin-static-copy|vite-plugin-static-copy\/)/,
  /^(vite-plugin-dts|vite-plugin-dts\/)/,

  /^(lodash-es|lodash-es\/)/,

  /\.(scss|sass|less|css)/,

  // eslint
  '@rushstack/eslint-patch/modern-module-resolution',
  '@typescript-eslint/parser',
  'eslint-define-config',

  // rollup
  '@rollup/plugin-terser'
]
