<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const drawer = ref(false)
const router = useRouter()
const route = useRoute()

// 菜单路径数组
const menuPaths = ['/mobile', '/pad', '/pc']

const menuRoutes = computed(() =>
  menuPaths.filter((path) => router.getRoutes().some((r) => r.path === path)),
)

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

  <VNavigationDrawer v-model="drawer" app temporary color="#f5faff">
    <VList>
      <VListItem
        v-for="path in menuRoutes"
        :key="path"
        class="d-flex align-center menu-item mb-2 rounded-lg"
        :active="route.path === path"
        color="primary"
        @click="goTo(path)"
      >
        <VIcon color="primary" class="mr-2">
          mdi-menu
        </VIcon>
        <span class="menu-path">{{ path }}</span>
      </VListItem>
    </VList>
  </VNavigationDrawer>

  <VMain>
    <div class="d-flex mt-4 flex-wrap gap-4">
      <VCard
        v-for="path in menuRoutes"
        :key="path"
        class="menu-card"
        :elevation="route.path === path ? 8 : 2"
        :color="route.path === path ? 'primary' : '#f5faff'"
        style="width: 200px; cursor: pointer; transition: box-shadow 0.2s;"
        @click="goTo(path)"
      >
        <VCardText class="d-flex align-center justify-center" style="height: 60px;">
          <VIcon :color="route.path === path ? 'white' : 'primary'" class="mr-2">
            mdi-menu
          </VIcon>
          <span :style="{ color: route.path === path ? '#fff' : '#333', fontWeight: 500 }">{{ path }}</span>
        </VCardText>
      </VCard>
    </div>
  </VMain>
</VApp>
</template>

<style scoped lang="scss">
.menu-item {
  transition: background 0.2s;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: #f0f4fa;
  }
  &.v-list-item--active {
    background: linear-gradient(90deg, #1976d2 60%, #42a5f5 100%) !important;
    color: #fff !important;
    .v-icon {
      color: #fff !important;
    }
    .menu-path {
      color: #fff !important;
    }
  }
}
.menu-path {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}
</style>
