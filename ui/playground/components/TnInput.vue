<script setup lang="ts">
interface Props {
  x?: string
  y?: string
  z?: string
}
interface Emits {
  'update:x': [string]
  'update:y': [string]
  'update:z': [string]
}

const props = withDefaults(defineProps<Props>(), {
  x: void 0,
  y: void 0,
  z: void 0,
})
const emit = defineEmits<Emits>()
const {
  x: _x,
  y: _y,
  z: _z,
} = useVModels(
  props,
  emit,
  { passive: true },
)
</script>

<template>
<div>
  <VTextField v-model="_x" />
  <VTextField v-model="_y" />
  <VTextField v-model="_z" />
</div>
</template>
