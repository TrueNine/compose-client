import {createLibraryVitestConfig} from '../vite/src/workspace-config.ts'
import viteConfig from './vite.config.ts'

export default createLibraryVitestConfig(import.meta, viteConfig)
