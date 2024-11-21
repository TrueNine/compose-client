<script setup lang="ts">
import {usePlaygroundStore} from '../../store'

import YPreAuthorize from '@/pre-authorize'

const store = usePlaygroundStore()

const acl = () => {
  return store.anon
}
const permissions = () => {
  return ['ROOT', 'ADMIN']
}
setTimeout(() => {
  store.anon = true
}, 3000)
</script>

<template>
  <YConfigPreAuthorize :anonymousProvider="acl" :permissionsProvider="permissions">
    <YPreAuthorize :permissions="['ROOT']"> 123 </YPreAuthorize>
  </YConfigPreAuthorize>
</template>
