<script setup lang="ts">
import type {YVSystemBarSlots} from './index'

const drawer = ref(false)
const settingsDrawer = ref(false)
defineSlots<YVSystemBarSlots>()
</script>
<template>
  <VApp>
    <VAppBar color="primary">
      <!-- 左侧菜单收展按钮 -->
      <VAppBarNavIcon @click="drawer = !drawer">
        <i i-mdi-menu text-8 />
      </VAppBarNavIcon>
      <!-- app 名称插槽 -->
      <VAppBarTitle>
        <slot name="app-title"> Application </slot>
      </VAppBarTitle>
      <VSpacer />
      <!-- 各种右侧的设置按钮 -->
      <slot name="app-settings" />
      <VAppBarNavIcon @click="settingsDrawer = !settingsDrawer">
        <i i-mdi-settings text-8 />
      </VAppBarNavIcon>
    </VAppBar>

    <VNavigationDrawer v-model="drawer" location="left" :border="false" temporary>
      <slot name="left-drawer" :collapsed="drawer" />
    </VNavigationDrawer>
    <!-- 右侧设置区域 -->
    <VNavigationDrawer v-model="settingsDrawer" location="right" :border="false" temporary>
      <slot name="settings-drawer" :collapsed="settingsDrawer" />
    </VNavigationDrawer>

    <!-- 显示主区域 -->
    <VMain>
      <VContainer>
        <slot />
      </VContainer>
    </VMain>
  </VApp>
</template>
