<script setup lang="ts">
import {YSiderMenu} from '@compose/meta-ui-web/index'
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
  <RouterView />
  <YSiderMenu :collapsed="false" :route-table="menus" :permissions="[]" :roles="[]"></YSiderMenu>
</template>

<style lang="scss">
html,
:root,
body {
  border: 0;
  padding: 0;
  margin: 0;
}
</style>
