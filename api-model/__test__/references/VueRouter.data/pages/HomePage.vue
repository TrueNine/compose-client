<script setup lang="ts">
import {YSiderMenu} from '@compose/meta-ui-web'
import type {RouteOption} from '@compose/compose-types'

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
</script>

<template>
  <YSiderMenu :route-table="menus" :permissions="[]" :roles="[]"/>
  <RouterView />
</template>
