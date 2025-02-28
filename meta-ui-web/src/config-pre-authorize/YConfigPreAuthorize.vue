<script setup lang="ts">
import type { PreAuthorizeInjection } from '@/common'

import type { YConfigPreAuthorizeProps } from '.'
import { PreAuthorizeInjectionSymbol } from '@/common'

import { maybeArray } from '@compose/api-model'

const props = withDefaults(defineProps<YConfigPreAuthorizeProps>(), {
  authedProvider: () => false,
  permissionsProvider: () => [],
  rolesProvider: () => [],
  anonymousProvider: () => false,
})

const _authed = computed(() => {
  return props.authedProvider()
})
const _anonymous = computed(() => {
  return props.anonymousProvider()
})
const _permissions = computed(() => {
  return props.permissionsProvider()
})
const _roles = computed(() => {
  return props.rolesProvider()
})

const impl: PreAuthorizeInjection = {
  isAuthed: () => _authed.value,
  isAnonymous: () => _anonymous.value,
  requirePermissions: permissions => _authed.value && maybeArray(_permissions.value).some(p => permissions.includes(p)),
  requireRoles: roles => _authed.value && maybeArray(_roles.value).some(r => roles.includes(r)),
  hasAnyPermissions: permissions => maybeArray(_permissions.value).some(p => permissions.includes(p)),
  hasAnyRoles: roles => maybeArray(_roles.value).some(r => roles.includes(r)),
  permissions: _permissions,
  roles: _roles,
  authed: _authed,
  anonymous: _anonymous,
}
provide(PreAuthorizeInjectionSymbol, impl)
defineExpose(impl)
</script>

<template>
  <slot name="default" />
</template>
