<script setup lang="ts">
import type {YPreAuthorizeProps} from '.'

import {isNil} from '@truenine/shared'

import {usePreAuthorize} from '@/common'

const props = withDefaults(defineProps<YPreAuthorizeProps>(), {
  authed: void 0,
  hasAnyPermissions: () => [],
  hasAnyRoles: () => [],
  permissions: () => [],
  roles: () => [],
  anonymous: void 0
})
const _handle = usePreAuthorize()
if (!_handle) throw new Error('usePreAuthorize is not defined')

const _authExp = computed(() => isNil(props.authed) ? true : props.authed === _handle.authed.value)

const _anonymousExp = computed(() => isNil(props.anonymous) ? true : props.anonymous === _handle.anonymous.value)

const _permissionsExp = computed(() => isNil(props.permissions) ? true : _handle.permissions.value.length && props.permissions.every(p => _handle.permissions.value.includes(p)))

const _rolesExp = computed(() => isNil(props.roles) ? true : props.roles.every(r => _handle.permissions.value.includes(r)))

const _hasPermissionsExp = computed(() => isNil(props.hasAnyPermissions) ? true : _handle.permissions.value.length && _handle.permissions.value.some(p => props.hasAnyPermissions.includes(p)))

const _hasRolesExp = computed(() => isNil(props.hasAnyRoles) ? true : _handle.roles.value.some(r => props.hasAnyRoles.includes(r)))

const _exp = computed(() => _authExp.value && _anonymousExp.value && _permissionsExp.value && _rolesExp.value && _hasPermissionsExp.value && _hasRolesExp.value)
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
    disabled: !_exp,
  }"
/>
<slot v-else name="forbidden" />
</template>
