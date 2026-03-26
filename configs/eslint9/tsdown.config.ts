import {createLibraryTsdownConfig} from '../vite/src/workspace-config.ts'

export default createLibraryTsdownConfig({
  entry: ['./src/index.ts'],
  platform: 'node',
  format: ['esm', 'cjs']
})
