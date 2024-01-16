function camelTo(str: string, sep: string = '-') {
  return str.replace(/([stepNodes-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}
export type ResolverType = 'component' | 'directive'
function resolveComponent(name: string) {
  if (name.match(/^Y[A-Z]/))
    return {
      name,
      from: '@compose/meta-ui-web',
      satisfies: [`@compose/meta-ui-web/dist/${camelTo(name)}/index.css`]
    }
}

export const MetaUiWebResolver = () => {
  return [
    {
      type: 'component' as ResolverType,
      resolve: resolveComponent
    }
  ]
}
