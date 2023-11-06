function camelTo(str: string, sep: string = '-') {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}

function resolveComponent(name: string) {
  if (name.match(/^Y[A-Z]/)) return {name, from: '@component/meta-ui-web'}
}

function resolveStyle(name: string) {
  if (name.match(/^Y[A-Z]/)) {
    const packageName = camelTo(name, '-')
    return {
      name: name,
      from: `@compose/meta-ui-web/${packageName}/index.css`
    }
  }
}

export const MetaUiWebResolver = () => {
  return [
    {
      type: 'component',
      resolve: resolveComponent
    },
    {
      type: 'directive',
      resolve: resolveStyle
    }
  ]
}
