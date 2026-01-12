<script lang="ts" setup>
import type {bool, RouteOption} from '@truenine/types'
import type {YElSiderMenuItemProps} from './index'

import {isNonNil} from '@truenine/shared'

const props = withDefaults(defineProps<YElSiderMenuItemProps>(), {collapsed: false, iconName: 'i-mdi-menu', idxKey: void 0, parentIndex: ''})

defineSlots()

function isSub(opt: RouteOption): bool {
  return isNonNil(opt.sub)
}
</script>

<template>
<ElSubMenu v-if="isSub(item)" :index="`${props.idxKey?.toString()}`">
  <template #title>
    <div>
      <slot name="icon" :item="item" />
    </div>
    <slot name="title" :item="item" />
  </template>
  <!-- 递归自身 -->
  <YElSiderMenuItem v-for="(it, idx) in item.sub" :key="idx" :idxKey="`${props.idxKey}/${it.uri ?? it.href}`" :item="it" :disabled="it.disabled">
    <template #icon="{ item: subItem }">
      <slot name="icon" :item="subItem" />
    </template>
    <template #title="{ item: subItem }">
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
