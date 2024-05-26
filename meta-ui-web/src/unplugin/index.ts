export type ResolverType = 'component' | 'directive'

function camelTo(str: string, sep: string = '-') {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}

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
const _vLabsComponentNames = [
  'VCalendar',
  'VNumberInput',
  'VPicker',
  'VDateInput',
  'VPullToRefresh',
  'VSnackbarQueue',
  'VStepperVertical',
  'VTimePicker',
  'VTreeview'
]
export function Vuetify3LabsLabResolver(useLabs: boolean = true) {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^V[A-Z]/)) return {name, from: useLabs && _vLabsComponentNames.includes(name) ? 'vuetify/labs/components' : 'vuetify/components'}
    }
  }
}
