<script setup lang="ts">
    import { RouteTable } from "@/router/RouteTable";

    const menus = ref(RouteTable);
</script>
<template>
    <YVSystemBar>
        <template #app-title>就叫马良吧</template>
        <template #left-drawer="{ collapsed }">
            <YElSiderMenu :collapsed="collapsed" :route-table="menus" :roles="[]" :permissions="[]" />
        </template>
        <RouterView />
    </YVSystemBar>
</template>
