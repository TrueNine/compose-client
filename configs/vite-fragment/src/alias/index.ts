import type {ManifestConfig} from '../types'
import {fileURLToPath, URL} from 'node:url'

export const ResolveAliasConfig = (cfg: ManifestConfig) => {
  console.log(cfg)
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL(`../../${cfg.features.entryRoot}`, import.meta.url))
      }
    }
  }
}
