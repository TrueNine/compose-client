import {createLibraryTsdownConfig} from '@truenine/config-vite/workspace-config'

export default createLibraryTsdownConfig({
  platform: 'node',
  unbundle: false,
  minify: true,
  format: ['cjs'],
  dts: {build: true},
  external: ['chrome-launcher', 'puppeteer-core']
})
