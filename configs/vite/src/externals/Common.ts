export function getNodeExternal(moduleName: string): (RegExp | string)[] {
  return [moduleName, `node:${moduleName}`, new RegExp(`^(${moduleName}|node:${moduleName}|node:${moduleName}\\/)`)]
}

export function getNodeExternals(moduleNames: string[]): (RegExp | string)[] {
  return [...new Set(moduleNames)]
    .map(m => m.trim())
    .flatMap(getNodeExternal)
}

export function getExternal(moduleName: string): (RegExp | string)[] {
  return [moduleName, new RegExp(`^(${moduleName}|${moduleName}\\/)`)]
}

export function getExternals(moduleNames: string[]): (RegExp | string)[] {
  return [...new Set(moduleNames)]
    .map(m => m.trim())
    .flatMap(getExternal)
}
