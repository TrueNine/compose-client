import type { Maybe } from '@truenine/types'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { inject } from 'vue'

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
  anonymous: ComputedRef<boolean>
}

export const PreAuthorizeInjectionSymbol: InjectionKey<PreAuthorizeInjection> = getProvideSymbolKey('PreAuthorizeInjection')

export function usePreAuthorize(): PreAuthorizeInjection | undefined {
  return inject(PreAuthorizeInjectionSymbol)
}
