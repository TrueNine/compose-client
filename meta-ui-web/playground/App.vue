<script setup lang="ts">
import type {RouteOption} from '@compose/compose-types'
import {useRouter} from 'vue-router'

const menus: RouteOption[] = [
  {
    uri: 'ab',
    name: 'ab',
    sub: [{uri: 'ef', name: 'ef'}]
  },
  {
    uri: 'cd',
    name: 'cd'
  }
]
const router = useRouter()
</script>

<template>
  <button @click="router.push(`details`)">details</button>
  <button @click="router.push(`/`)">home</button>
  <RouterView />
  <YSiderMenu :collapsed="false" :route-table="menus" :permissions="[]" :roles="[]"></YSiderMenu>
</template>

<style lang="scss">
html,
:root,
body {
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
