import { getExternals } from './Common'

export const ViteExternals = [
  ...getExternals([
    'vite',
    'fast-global',
    'fast-diff',
  ]),
  /^vite:/,
]
