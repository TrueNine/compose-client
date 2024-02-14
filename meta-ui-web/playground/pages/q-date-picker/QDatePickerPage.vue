<script setup lang="ts">
    //

    const range = ref<[number, number]>();
    const value = ref<number>();
</script>

<template>
    {{ range }}
    {{ value }}
    <VCard>
        <VCardText>
            <YQDatePicker v-model:value="value" landscape />
        </VCardText>
    </VCard>
</template>
