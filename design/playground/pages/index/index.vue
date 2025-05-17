<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const menuFullPaths = Array.from(
  new Set(
    router.getRoutes().map((r) => router.resolve({ path: r.path }).fullPath),
  ),
).toSorted()

function goTo(path: string) {
  if (route.path !== path) {
    void router.push(path)
  }
}
</script>

<template>
<div class="d-flex mt-4 w-full flex-wrap justify-center gap-4">
  <VCard
    v-for="path in menuFullPaths"
    :key="path"
    class="menu-card h-20 w-full cursor-pointer border-none p-0 transition-shadow md:w-72 sm:w-60"
    :elevation="route.fullPath === path ? 8 : 2"
    :class="route.fullPath === path ? 'bg-primary text-white' : 'bg-[#f5faff] dark:bg-dark-2 text-[#333] dark:text-white'"
    @click="goTo(path)"
  >
    <VCardText class="d-flex align-center h-full justify-center p-0">
      <VIcon :color="route.fullPath === path ? 'white' : 'primary'" class="mr-2 text-xl" />
      <span class="text-base font-500">{{ path }}</span>
    </VCardText>
  </VCard>
</div>
</template>
