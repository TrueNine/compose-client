<script setup lang="ts">
import {type YSystemBarProps, type YVSystemBarSlots} from './index'
const props = withDefaults(defineProps<YSystemBarProps>(), {
  showAppBar: true
})

const drawer = ref(false)
const settingsDrawer = ref(false)
const slots = defineSlots<YVSystemBarSlots>()
const useLeft = computed(() => {
  return slots['left-btn'] !== undefined
})
const useRight = computed(() => {
  return slots['right-btn'] !== undefined
})
</script>
<template>
  <VApp>
    <VAppBar v-if="props.showAppBar" color="primary">
      <!-- 左侧菜单收展按钮 -->
      <slot name="left-btn">
        <VAppBarNavIcon role="switch" :aria-checked="drawer" :aria-label="drawer ? '关闭左侧菜单' : '打开左侧菜单'" @click="drawer = !drawer">
          <i i-mdi-menu text-8 />
        </VAppBarNavIcon>
      </slot>

      <!-- app 名称插槽 -->
      <VAppBarTitle>
        <slot name="app-title"> Application</slot>
      </VAppBarTitle>
      <VSpacer />

      <!-- 各种右侧的设置按钮 -->
      <slot name="app-settings" />
      <slot name="right-btn">
        <VAppBarNavIcon
          role="switch"
          :aria-checked="settingsDrawer"
          :aria-label="settingsDrawer ? '关闭设置侧边栏' : '打开设置侧边栏'"
          @click="settingsDrawer = !settingsDrawer"
        >
          <i i-mdi-settings text-8 />
        </VAppBarNavIcon>
      </slot>
    </VAppBar>

    <!-- 显示主区域 -->
    <VMain>
      <VContainer>
        <slot />
      </VContainer>
    </VMain>

    <!-- 左侧菜单区域 -->
    <VNavigationDrawer v-if="!useLeft && props.showAppBar" v-model="drawer" location="left" :border="false" :temporary="true">
      <slot name="left-drawer" :collapsed="drawer" />
    </VNavigationDrawer>

    <!-- 右侧设置区域 -->
    <VNavigationDrawer v-if="!useRight && props.showAppBar" v-model="settingsDrawer" location="right" :border="false" temporary>
      <slot name="settings-drawer" :collapsed="settingsDrawer" />
    </VNavigationDrawer>
  </VApp>
</template>
