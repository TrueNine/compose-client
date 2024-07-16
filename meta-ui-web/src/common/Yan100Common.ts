import type {InjectionKey} from '@vue/runtime-core'
import type {Ref} from 'vue'
import type {Maybe} from '@compose/api-types'
export {}

const providePrefix = '__MetaUIProvideSymbolKey__'

function getProvideSymbolKey<T = unknown>(key: string): InjectionKey<T> {
  return Symbol(`${providePrefix}${key}`)
}

export interface PreAuthorizeInjection {
  hasAnyPermissions: (permissions: Maybe<string>) => boolean
  requirePermissions: (permissions: Maybe<string>) => void
  hasAnyRoles: (roles: Maybe<string>) => boolean
  requireRoles: (roles: Maybe<string>) => void
  isAuthed: () => boolean
  isAnonymous: () => boolean
  permissions: Ref<string[]>
  roles: Ref<string[]>
  authed: Ref<boolean>
  anonymous: Ref<boolean>
}

export const PreAuthorizeInjectionSymbol: InjectionKey<PreAuthorizeInjection> = getProvideSymbolKey('PreAuthorizeInjection')

export function usePreAuthorize() {
  return inject(PreAuthorizeInjectionSymbol)!
}
