<script lang="ts" setup>
import {RouteStream} from '@compose/api-model'
import type {RouteOption} from '@compose/compose-types'
import {ref, watch} from 'vue'
import {ElMenu} from 'element-plus'

import 'element-plus/es/components/menu/style/css'
import YSiderMenuItem from '../sider-menu-item'

import type {Props} from './index'

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const menus = ref<RouteOption[]>(props.routeTable)

watch(
  () => props.routeTable,
  v => {
    const stream = new RouteStream(v, {
      permissions: props.permissions,
      roles: props.roles
    })
    menus.value = stream.matchClip()
  },
  {
    deep: true
  }
)
</script>

<template>
  <ElMenu router :collapse="collapsed">
    <YSiderMenuItem v-for="(it, idx) in menus" :key="idx" :collapsed="collapsed" :item="it" :idx-key="it.uri">
      <template #icon="{item}">
        <div :class="[item.iconName ?? 'i-mdi-menu', item.iconClass ? item.iconClass : 'c-p', `text-2xl`]" />
      </template>
      <template #title="{item}">
        <span>{{ item.name }}</span>
      </template>
    </YSiderMenuItem>
  </ElMenu>
</template>
