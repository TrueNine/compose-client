export type ResolverType = 'component' | 'directive'

function camelTo(str: string, sep = '-'): string {
  const firstCharLower = str.charAt(0).toLowerCase() + str.slice(1) // Example: YButton -> yButton, YTestComponent -> yTestComponent
  return firstCharLower.replaceAll(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase() // Example: yButton -> y-button, yTestComponent -> y-test-component
}

function resolveComponent(name: string): {
  name: string
  from: string
  satisfies: string[]
} | undefined {
  if (!/^Y[A-Z]/.test(name)) return

  const _kebabName = camelTo(name.slice(1))
  return {name, from: '@truenine/ui', satisfies: []}
}

export function MetaUiWebResolver(): {
  type: string
  resolve: (name: string) => {
    name: string
    from: string
    satisfies: string[]
  } | undefined
}[] {
  return [
    {type: 'component', resolve: resolveComponent}
  ]
}

const _vLabsComponentNames = new Set([
  'VCalendar',
  'VNumberInput',
  'VPicker',
  'VDateInput',
  'VPullToRefresh',
  'VSnackbarQueue',
  'VStepperVertical',
  'VTimePicker',
  'VTreeview'
])
export function Vuetify3LabsLabResolver(useLabs = true): {type: string, resolve: (name: string) => {name: string, from: string} | undefined} {
  return {type: 'component', resolve: (name: string) => {
    if (/^V[A-Z]/.test(name)) return {name, from: useLabs && _vLabsComponentNames.has(name) ? 'vuetify/labs/components' : 'vuetify/components'}
  }}
}
