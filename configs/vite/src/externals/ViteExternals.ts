import { getExternals } from './Common'

export const ViteExternals: (string | RegExp)[] = [
  ...getExternals([
    'vite',
    'fast-global',
    'fast-diff',
  ]),
  /^vite:/,
]
