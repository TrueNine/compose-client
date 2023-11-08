<script lang="ts" setup>
import {type RouteOption, type SafeAny} from '@compose/compose-types'
import {isNonEmpty} from '@compose/api-model'

import YElSiderMenuItem from './YElSiderMenuItem.vue'

import type {Props} from './index'

withDefaults(defineProps<Props>(), {
  collapsed: false,
  iconName: 'i-mdi-menu',
  idxKey: undefined,
  parentIndex: ''
})

defineSlots<{
  icon(props: {item: RouteOption}): SafeAny
  title(props: {item: RouteOption}): SafeAny
}>()

function isSub(opt: RouteOption): boolean {
  return isNonEmpty(opt?.sub)
}
</script>
<template>
  <ElSubMenu v-if="isSub(item)" :index="'' + idxKey?.toString()">
    <template #title>
      <div>
        <slot name="icon" :item="item" />
      </div>
      <slot name="title" :item="item" />
    </template>
    <!-- 递归自身 -->
    <YElSiderMenuItem v-for="(it, idx) in item.sub" :key="idx" :idx-key="idxKey + '/' + (it.uri ?? it.href)" :item="it" :disabled="it.disabled">
      <template #icon="{item: subItem}">
        <slot name="icon" :item="subItem" />
      </template>
      <template #title="{item: subItem}">
        <span><slot name="title" :item="subItem" /></span>
      </template>
    </YElSiderMenuItem>
  </ElSubMenu>
  <!-- 自定义 icon 以div方式渲染，非 Block 元素无高度 -->
  <ElMenuItem v-else :index="`/${idxKey}`" :disabled="item.disabled">
    <slot name="icon" :item="item" />
    <template #title>
      <span><slot name="title" :item="item" /></span>
    </template>
  </ElMenuItem>
</template>
