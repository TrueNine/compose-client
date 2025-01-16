export type ResolverType = 'component' | 'directive'

function camelTo(str: string, sep = '-') {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}

function resolveComponent(name: string) {
  if (/^Y[A-Z]/.exec(name))
    return {
      name,
      from: '@compose/meta-ui-web',
      satisfies: [`@compose/meta-ui-web/${camelTo(name)}/index.css`]
    }
}

export const MetaUiWebResolver = () => {
  return [
    {
      type: 'component' satisfies ResolverType,
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
export function Vuetify3LabsLabResolver(useLabs = true) {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^V[A-Z]/.exec(name)) return {name, from: useLabs && _vLabsComponentNames.includes(name) ? 'vuetify/labs/components' : 'vuetify/components'}
    }
  }
}
