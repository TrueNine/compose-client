<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const drawer = ref(false)
const router = useRouter()
const route = useRoute()

const menuRoutes = computed(() =>
  router.getRoutes().filter((r) => r.path && r.path !== '/'),
)

// 路由与图标映射（可自定义）
const iconMap: Record<string, string> = {
  '/frame': 'mdi-view-dashboard',
  // 其他路由可继续添加
}

function getIcon(path: string) {
  return iconMap[path] || 'mdi-menu'
}

function goTo(path: string) {
  drawer.value = false
  if (route.path !== path) {
    void router.push(path)
  }
}
</script>

<template>
<VApp>
  <VAppBar app color="primary" dark>
    <VAppBarNavIcon @click="drawer = !drawer">
      <VIcon>mdi-menu</VIcon>
    </VAppBarNavIcon>
    <VToolbarTitle>Playground 菜单</VToolbarTitle>
  </VAppBar>

  <VNavigationDrawer v-model="drawer" app temporary color="grey lighten-4">
    <VList>
      <VListItem
        v-for="r in menuRoutes"
        :key="r.path"
        :active="route.path === r.path"
        color="primary"
        @click="goTo(r.path)"
      >
        <VIcon color="primary" class="mr-2">{{ getIcon(r.path) }}</VIcon>
        <VListItemTitle>{{ r.path }}</VListItemTitle>
      </VListItem>
    </VList>
  </VNavigationDrawer>

  <VMain>
    <div class="pa-4">
      <code>{{ JSON.stringify(menuRoutes.map((r) => r.path), null, 2) }}</code>
    </div>
  </VMain>
</VApp>
</template>
