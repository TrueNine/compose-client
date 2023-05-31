export function debug(msg?: unknown, enbale?: boolean) {
  const debugMode = enbale === true
  if (debugMode) {
    console.log('\n==============================================')
    console.log(msg)
    console.log('==============================================\n')
  }
}
