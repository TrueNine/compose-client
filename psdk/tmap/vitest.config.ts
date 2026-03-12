import {createLibraryVitestConfig} from '@truenine/config-vite/workspace-config'
import viteConfig from './vite.config'

export default createLibraryVitestConfig(import.meta, viteConfig)
