import {getNodeExternals} from './Common'

export const NodeExternals: (string | RegExp)[] = [
  ...getNodeExternals(['path', 'events', 'module', 'url', 'assert', 'crypto', 'stream', 'fs', 'util', 'os', 'os', 'fsevents']),
  /^node/
]
