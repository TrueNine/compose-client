import {createLibraryTsdownConfig} from './src/workspace-config.ts'

export default createLibraryTsdownConfig({
  platform: 'node',
  format: ['esm', 'cjs']
})
