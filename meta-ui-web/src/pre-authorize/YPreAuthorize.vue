<script setup lang="tsx">
import {usePreAuthorize} from '@/common'
import type {YPreAuthorizeProps} from '.'
import type {dynamic} from '@compose/api-types'

const _handle = usePreAuthorize()

function isEmpty(v: dynamic) {
  return v === null || v === void 0
}

const props = withDefaults(defineProps<YPreAuthorizeProps>(), {
  authed: void 0,
  anonymous: void 0
})

const _authExp = computed(() => {
  if (isEmpty(props.authed)) return true
  else return props.authed === _handle.authed.value
})
const _anonymousExp = computed(() => {
  if (isEmpty(props.anonymous)) return true
  else return props.anonymous === _handle.anonymous.value
})
const _permissionsExp = computed(() => {
  if (isEmpty(props.permissions)) return true
  else return _handle.permissions.value && _handle.permissions.value.length && props.permissions?.every(p => _handle.permissions.value?.includes(p) ?? false)
})
const _rolesExp = computed(() => {
  if (isEmpty(props.roles)) return true
  else return _handle.roles.value && _handle.roles.value.length && props.roles?.every(r => _handle.permissions.value?.includes(r) ?? false)
})
const _hasPermissionsExp = computed(() => {
  if (isEmpty(props.hasAnyPermissions)) return true
  else return _handle.permissions.value && _handle.permissions.value.length && _handle.permissions.value.some(p => props.hasAnyPermissions?.includes(p))
})
const _hasRolesExp = computed(() => {
  if (isEmpty(props.hasAnyRoles)) return true
  else return _handle.roles.value.some(r => props.hasAnyRoles?.includes(r))
})
const _exp = computed(() => {
  return _authExp.value && _anonymousExp.value && _permissionsExp.value && _rolesExp.value && _hasPermissionsExp.value && _hasRolesExp.value
})
</script>

<template v-if="_exp">
  <slot
    v-if="_exp"
    name="default"
    v-bind="{
      roles: _handle.roles.value,
      permissions: _handle.permissions.value,
      anonymous: _handle.anonymous.value,
      authed: _handle.authed.value,
      allowed: _exp,
      disabled: !_exp
    }"
  />
  <slot v-else name="forbidden" />
</template>
