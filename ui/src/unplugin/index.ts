export type ResolverType = 'component' | 'directive'

function camelTo(str: string, sep = '-'): string {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}

function resolveComponent(name: string): { name: string, from: string, satisfies: string[] } | undefined {
  if (/^Y[A-Z]/.exec(name)) {
    return {
      name,
      from: '@compose/ui',
      satisfies: [`@compose/ui/${camelTo(name)}/index.css`],
    }
  }
}

export function MetaUiWebResolver(): { type: string, resolve: (name: string) => { name: string, from: string, satisfies: string[] } | undefined }[] {
  return [
    {
      type: 'component' satisfies ResolverType,
      resolve: resolveComponent,
    },
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
  'VTreeview',
]
export function Vuetify3LabsLabResolver(useLabs = true): { type: string, resolve: (name: string) => { name: string, from: string } | undefined } {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^V[A-Z]/.exec(name)) {
        return { name, from: useLabs && _vLabsComponentNames.includes(name) ? 'vuetify/labs/components' : 'vuetify/components' }
      }
    },
  }
}
