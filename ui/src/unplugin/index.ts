export type ResolverType = 'component' | 'directive'

const CAMEL_BOUNDARY_PATTERN = /([a-z0-9])([A-Z])/g
const META_UI_COMPONENT_PATTERN = /^Y[A-Z]/
const VUETIFY_COMPONENT_PATTERN = /^V[A-Z]/

function camelTo(str: string, sep = '-'): string {
  const firstCharLower = str.charAt(0).toLowerCase() + str.slice(1) // Example: YButton -> yButton, YTestComponent -> yTestComponent
  return firstCharLower.replaceAll(CAMEL_BOUNDARY_PATTERN, `$1${sep}$2`).toLowerCase() // Example: yButton -> y-button, yTestComponent -> y-test-component
}

function resolveComponent(name: string): {
  name: string
  from: string
  satisfies: string[]
} | undefined {
  if (!META_UI_COMPONENT_PATTERN.test(name)) return

  const _kebabName = camelTo(name.slice(1))
  return {name: 'default', from: `@truenine/ui/components/${_kebabName}/index`, satisfies: [`@truenine/ui/dist/components/${_kebabName}/index.css`]}
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
    if (VUETIFY_COMPONENT_PATTERN.test(name)) return {name, from: useLabs && _vLabsComponentNames.has(name) ? 'vuetify/labs/components' : 'vuetify/components'}
  }}
}
