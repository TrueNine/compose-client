<script setup lang="ts">
import YPreAuthorize from '@/pre-authorize'
import {usePlaygroundStore} from '../../store'

const store = usePlaygroundStore()

const acl = () => {
  return store.anon
}
setTimeout(() => {
  store.anon = true
}, 3000)
</script>

<template>
  <YConfigPreAuthorize :anonymous-provider="acl">
    <YPreAuthorize>
      <template #default="e">
        {{ e }}
      </template>
    </YPreAuthorize>
  </YConfigPreAuthorize>
</template>
