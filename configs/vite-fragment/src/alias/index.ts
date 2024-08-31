import type {ManifestConfig} from '../types'

export const ResolveAliasConfig = (cfg: ManifestConfig) => {
  console.log(cfg)
  return {
    resolve: {
      alias: {}
    }
  }
}
