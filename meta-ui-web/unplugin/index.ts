function camelTo(str: string, sep: string = '-') {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}
export type ResolverType = 'component' | 'directive'
function resolveComponent(name: string) {
  if (name.match(/^Y[A-Z]/)) return {name, from: '@compose/meta-ui-web'}
}

function resolveStyle(name: string) {
  if (name.match(/^Y[A-Z]/)) {
    const packageName = camelTo(name, '-')
    return {
      name: name,
      from: `@compose/meta-ui-web/dist/${packageName}/index.css`
    }
  }
}

export const MetaUiWebResolver = () => {
  return [
    {
      type: 'component' as ResolverType,
      resolve: resolveComponent
    },
    {
      type: 'directive' as ResolverType,
      resolve: resolveStyle
    }
  ]
}
