<script lang="ts" setup>
import {RouteStream} from '@compose/api-model'

import YSiderMenuItem from '../el-sider-menu-item'

import type {Emits, Props} from './index'

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})
const emits = defineEmits<Emits>()

const menus = computed({
  get: () => props.routeTable,
  set: v => emits('update:routeTable', v)
})

watch(
  () => menus,
  v => {
    const stream = new RouteStream(v.value, {
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
  <ElMenu router :collapse="!collapsed">
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
