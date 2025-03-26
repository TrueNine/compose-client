<script setup lang="ts">
import YPreAuthorize from '@/pre-authorize'

import { usePlaygroundStore } from '../../store'

const store = usePlaygroundStore()

function acl() {
  return store.anon
}
function permissions() {
  return ['ROOT', 'ADMIN']
}
setTimeout(() => {
  store.anon = true
}, 3000)
</script>

<template>
<YConfigPreAuthorize :anonymousProvider="acl" :permissionsProvider="permissions">
  <YPreAuthorize :permissions="['ROOT']">
    123
  </YPreAuthorize>
</YConfigPreAuthorize>
</template>
