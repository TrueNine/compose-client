<script setup lang="ts">
import type {RouteOption} from '@compose/api-types'

import YVMenu from '@/v-menu/index'

const routes = ref<RouteOption[]>([])
routes.value = [
  {
    name: '首页首页首页首页首页首页首页',
    uri: '/',
    tags: ['dev', 'test', 'react']
  },
  {
    name: '菜单1',
    uri: 'a'
  },
  {
    name: '菜单2',
    uri: 'b'
  },
  {
    name: '菜单3折叠菜单',
    uri: 'c',
    sub: [
      {
        name: '菜单3-1',
        uri: 'c1',
        tags: ['dev']
      },
      {
        name: '菜单3-2',
        uri: 'c2'
      },
      {
        name: '菜单3-3',
        uri: 'c3',
        sub: [
          {
            name: '菜单3-3-1',
            uri: 'c3-1'
          },
          {
            name: '菜单3-3-2',
            uri: 'c3-2'
          },
          {
            name: '菜单3-3-3',
            uri: 'c3-3'
          }
        ]
      }
    ]
  }
]
const value = ref()
</script>
<template>
  <VMain>
    <h1 absolute z-1000>{{ value }}</h1>
  </VMain>
  <YVMenu v-model:value="value" pathPrefix="/prefix" :routes="routes" />
</template>
