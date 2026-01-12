<script setup lang="ts">
import type {YConfigPreAuthorizeProps} from '.'
import type {PreAuthorizeInjection} from '@/common'
import {maybeArray} from '@truenine/shared'
import {PreAuthorizeInjectionSymbol} from '@/common'

const props = withDefaults(defineProps<YConfigPreAuthorizeProps>(), {authedProvider: () => false, permissionsProvider: () => [], rolesProvider: () => [], anonymousProvider: () => false})

// 合并相关的状态计算
const state = computed(() => ({authed: props.authedProvider(), anonymous: props.anonymousProvider(), permissions: maybeArray(props.permissionsProvider()), roles: maybeArray(props.rolesProvider())}))

// 预计算权限注入实现
const impl = computed<PreAuthorizeInjection>(() => ({
  isAuthed: () => state.value.authed,
  isAnonymous: () => state.value.anonymous,
  requirePermissions: permissions =>
    state.value.authed && state.value.permissions.some(p => permissions.includes(p)),
  requireRoles: roles =>
    state.value.authed && state.value.roles.some(r => roles.includes(r)),
  hasAnyPermissions: permissions =>
    state.value.permissions.some(p => permissions.includes(p)),
  hasAnyRoles: roles =>
    state.value.roles.some(r => roles.includes(r)),
  permissions: computed(() => state.value.permissions),
  roles: computed(() => state.value.roles),
  authed: computed(() => state.value.authed),
  anonymous: computed(() => state.value.anonymous),
}))

provide(PreAuthorizeInjectionSymbol, impl.value)
defineExpose(impl.value)
</script>

<template>
<slot name="default" />
</template>
