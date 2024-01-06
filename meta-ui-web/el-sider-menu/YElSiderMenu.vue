<script lang="ts" setup>
import {RouteStream} from '@compose/api-model'
import {STR_EMPTY, STR_SLASH} from '@compose/api-types'

import YSiderMenuItem from '../el-sider-menu-item'

import type {YElSiderMenuEmits, YElSiderMenuProps} from './index'

const props = withDefaults(defineProps<YElSiderMenuProps>(), {
  collapsed: false,
  routeMode: true,
  pathPrefix: '',
  roles: () => [],
  permissions: () => []
})

const emits = defineEmits<YElSiderMenuEmits>()
const prefix = computed(() => (props.pathPrefix ? props.pathPrefix + STR_SLASH : STR_EMPTY))

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
// @unocss-include
</script>

<template>
  <ElMenu :router="routeMode" :collapse="!collapsed">
    <YSiderMenuItem v-for="(it, idx) in menus" :key="idx" :collapsed="collapsed" :item="it" :idx-key="prefix + it.uri">
      <template #icon="{item}">
        <div :class="[item.iconClass ? item.iconClass : 'c-p']" text-2xl>
          <div :class="[item.iconName ?? 'i-mdi-menu']" />
        </div>
      </template>
      <template #title="{item}">{{ item.name }}</template>
    </YSiderMenuItem>
  </ElMenu>
</template>
