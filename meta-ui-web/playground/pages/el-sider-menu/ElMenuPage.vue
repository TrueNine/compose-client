import type { YElSiderMenu } from 'index';
<script setup lang="ts">
import type {RouteOption} from '@compose/compose-types'

const routeTable = ref<RouteOption[]>([
  {
    uri: 'a',
    name: 'A',
    sub: [
      {uri: 'c', name: 'C'},
      {
        uri: 'd',
        name: 'D',
        sub: [
          {uri: 'f', name: 'F'},
          {uri: 'gg', name: 'GG'}
        ]
      }
    ]
  },
  {
    uri: 'b',
    name: 'B'
  }
])
</script>

<template>
  <div class="w-1/5">
    <YElSiderMenu :route-table="routeTable" :collapse="false" parent-index="acl" />
  </div>
</template>
