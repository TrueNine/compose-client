<script setup lang="ts">
import {maybeArray} from '@compose/api-model'

import type {YConfigPreAuthorizeProps} from '.'

import {type PreAuthorizeInjection, PreAuthorizeInjectionSymbol} from '@/common'

const props = withDefaults(defineProps<YConfigPreAuthorizeProps>(), {
  authedProvider: () => false,
  permissionsProvider: () => [],
  rolesProvider: () => [],
  anonymousProvider: () => false
})

const _authed = computed(() => {
  const f = props.authedProvider
  if (f) return f()
  else return false
})
const _anonymous = computed(() => {
  const f = props.anonymousProvider
  if (f) return f()
  else return false
})
const _permissions = computed(() => {
  const f = props.permissionsProvider
  if (f) return f()
  else return []
})
const _roles = computed(() => {
  const f = props.rolesProvider
  if (f) return f()
  else return []
})

const impl: PreAuthorizeInjection = {
  isAuthed: () => _authed.value,
  isAnonymous: () => _anonymous.value,
  requirePermissions: permissions => _authed.value && maybeArray(_permissions.value).some(p => permissions.includes(p)),
  requireRoles: roles => _authed.value && maybeArray(_roles.value).some(r => roles.includes(r)),
  hasAnyPermissions: permissions => maybeArray(_permissions.value).some(p => permissions.includes(p)) ?? false,
  hasAnyRoles: roles => maybeArray(_roles.value).some(r => roles.includes(r)) ?? false,
  permissions: _permissions,
  roles: _roles,
  authed: _authed,
  anonymous: _anonymous
}
provide(PreAuthorizeInjectionSymbol, impl)
defineExpose(impl)
</script>

<template>
  <slot name="default" />
</template>
