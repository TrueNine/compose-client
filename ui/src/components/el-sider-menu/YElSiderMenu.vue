<script setup lang="ts">
import type {YElSiderMenuEmits, YElSiderMenuProps} from './index'

import {STR_EMPTY, STR_SLASH} from '@truenine/shared'

import YSiderMenuItem from '../el-sider-menu-item'

const props = withDefaults(defineProps<YElSiderMenuProps>(), {
  collapsed: false,
  routeMode: true,
  pathPrefix: '',
  roles: () => [],
  permissions: () => []
})
const emits = defineEmits<YElSiderMenuEmits>()

const prefix = computed(() => (props.pathPrefix ? props.pathPrefix + STR_SLASH : STR_EMPTY))
const menus = useVModel(props, 'routeTable', emits, {passive: true})
</script> // @unocss-include

<template>
<ElMenu :router="routeMode" :collapse="!collapsed">
  <YSiderMenuItem v-for="(it, idx) in menus" :key="idx" :collapsed="collapsed" :item="it" :idxKey="prefix + it.uri">
    <template #icon="{ item }">
      <div :class="[item.iconClass ? item.iconClass : 'c-p']" text-2xl>
        <div :class="[item.iconName ?? 'i-mdi-menu']" />
      </div>
    </template>
    <template #title="{ item }">
      {{ item.name }}
    </template>
  </YSiderMenuItem>
</ElMenu>
</template>
