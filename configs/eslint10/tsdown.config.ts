import {createLibraryTsdownConfig} from '../vite/src/workspace-config.ts'

export default createLibraryTsdownConfig({
  cjsDefault: false,
  entry: ['./src/**/*', '!**/*.{spec,test}.*', '!**/*.md'],
  platform: 'node',
  format: ['esm', 'cjs']
})
