<script setup lang="ts">
import type {RouteOption} from '@compose/api-types'

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
    <template #left-btn>
      <VAppBarNavIcon>
        <i i-mdi-home-outline text-8 />
      </VAppBarNavIcon>
    </template>
    <template #left-drawer="{collapsed}">
      <YElSiderMenu :collapsed="collapsed" :route-table="menus" :roles="[]" :permissions="[]" />
    </template>
  </YVSystemBar>
</template>
