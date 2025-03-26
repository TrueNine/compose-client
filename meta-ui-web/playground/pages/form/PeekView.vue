<script setup lang="ts">
interface Props {
  modelValue?: string
  other1?: string
  other2?: string
}
interface Emits {
  'update:modelValue': [str: string]
  'update:other1': [str: string]
  'update:other2': [str: string]
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  other1: '',
  other2: '',
})
const emit = defineEmits<Emits>()
const { modelValue, other1, other2 } = useVModels(
  props,
  emit,
  { passive: true },
)
</script>

<template>
<VCard>
  <VCardText>
    <VTextField v-model="modelValue" />
    <VTextField v-model="other1" />
    <VTextField v-model="other2" />
  </VCardText>
</VCard>
</template>
