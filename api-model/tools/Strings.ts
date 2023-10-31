export function camelTo(str: string, sep: string = '-') {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}
