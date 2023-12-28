<script setup lang="ts">
import type {RouteOption} from '@compose/compose-types'

const menus = ref<RouteOption[]>([
  {
    uri: 'ab',
    name: 'AB'
  },
  {
    uri: 'cd',
    name: 'CD'
  }
])
</script>
<template>
  <YVSystemBar>
    <template #left-drawer="{collapsed}">
      <YElSiderMenu :collapsed="collapsed" :route-table="menus" :roles="[]" :permissions="[]" />
    </template>
  </YVSystemBar>
</template>
