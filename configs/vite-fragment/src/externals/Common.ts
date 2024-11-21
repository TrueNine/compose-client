export function getNodeExternal(moduleName: string) {
  return [moduleName, `node:${moduleName}`, new RegExp(`^(${moduleName}|node:${moduleName}|node:${moduleName}\\/)`)]
}

export function getNodeExternals(moduleNames: string[]) {
  return Array.from(new Set(moduleNames))
    .map(m => m.trim())
    .map(getNodeExternal)
    .flat()
}

export function getExternal(moduleName: string) {
  return [moduleName, new RegExp(`^(${moduleName}|${moduleName}\\/)`)]
}

export function getExternals(moduleNames: string[]) {
  return Array.from(new Set(moduleNames))
    .map(m => m.trim())
    .map(getExternal).flat()
}
