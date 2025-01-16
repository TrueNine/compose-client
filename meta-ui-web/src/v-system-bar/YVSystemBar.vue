<script setup lang="ts">
import type {YSystemBarProps, YVSystemBarEmits, YVSystemBarSlots} from './index'

const props = withDefaults(defineProps<YSystemBarProps>(), {
  showAppBar: true,
  progress: 0,
  progressLoading: false,
  progressColor: 'default',
  menuOpened: false,
  settingsMenuOpened: false
})
const emits = defineEmits<YVSystemBarEmits>()
const slots = defineSlots<YVSystemBarSlots>()

const {
  menuOpened: _menuOpened,
  progress: _progress,
  progressLoading: _progressLoading,
  settingsMenuOpened: _settingsMenuOpened
} = useVModels(props, emits, {passive: true})
const progressClr = computed(() => _progressLoading.value && _progress.value === 0)
const useRight = computed(() => {
  return !!slots['right-btn']
})
</script>

<template>
  <VApp>
    <VAppBar v-if="props.showAppBar" color="primary">
      <!-- 左侧菜单收展按钮 -->
      <slot name="left-btn">
        <VAppBarNavIcon role="switch" :aria-checked="_menuOpened" :aria-label="_menuOpened ? '关闭菜单' : '打开菜单'" @click="_menuOpened = !_menuOpened">
          <YIco i-mdi:menu class="text-8" />
        </VAppBarNavIcon>
      </slot>

      <!-- app 名称插槽 -->
      <VAppBarTitle>
        <slot name="app-title"> Application</slot>
      </VAppBarTitle>
      <VSpacer />

      <!-- 各种的设置按钮 -->
      <slot name="app-settings" />
      <slot name="right-btn">
        <VAppBarNavIcon
          role="switch"
          :aria-checked="_settingsMenuOpened"
          :aria-label="_settingsMenuOpened ? '关闭设置侧边栏' : '打开设置侧边栏'"
          @click="_settingsMenuOpened = !_settingsMenuOpened"
        >
          <YIco class="text8" i-mdi:settings />
        </VAppBarNavIcon>
      </slot>
    </VAppBar>

    <!-- 显示主区域 -->
    <VMain px2>
      <VProgressLinear v-model="_progress" :striped="true" :active="_progressLoading" :indeterminate="progressClr">
        <template #default="{value}" v-if="!progressClr">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </VProgressLinear>
      <slot name="default" />
    </VMain>

    <!-- 菜单区域 -->
    <slot :menuOpened="_menuOpened" name="drawer" />

    <!-- 设置菜单 -->
    <VNavigationDrawer v-if="!useRight && props.showAppBar" v-model="_settingsMenuOpened" location="right" :border="false" temporary>
      <slot name="settings-drawer" :settingsMenuOpened="_settingsMenuOpened" />
    </VNavigationDrawer>
  </VApp>
</template>
