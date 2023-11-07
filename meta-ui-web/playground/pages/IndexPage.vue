<script setup lang="ts">
const router = useRouter()
const routes = router.getRoutes()
</script>

<template>
  <div>{{ router.currentRoute.value.path }}</div>
  <VRow shadow-sm p-2>
    <VCol v-for="it in routes" :key="it.name" xxl="1" xl="3" :cols="12" md="4" sm="8">
      <VChip color="primary" @click="router.push(it.path)">{{ it.name }} | {{ it.path }}</VChip>
    </VCol>
  </VRow>
  <RouterView />
</template>
