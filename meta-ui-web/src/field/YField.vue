<script setup lang="tsx">
import type { YFieldEmits, YFieldProps, YFieldSlots } from '@/field/index'
import { maybeArray } from '@compose/api-model'

const props = withDefaults(defineProps<YFieldProps>(), {
  modelValue: void 0,
})
const emits = defineEmits<YFieldEmits>()
const slots = defineSlots<YFieldSlots>()

const _names = useVModel(props, 'name', emits, { passive: true })

const _effectModels = computed(() => {
  const mo = _names.value
  if (typeof mo === 'string') {
    return { [mo]: 'modelValue' }
  }
  const names = maybeArray(mo)
  const result: Record<string, string> = {}
  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    if (typeof name === 'string') {
      result[name] = i === 0 ? 'modelValue' : name
    } else {
      Object.assign(result, name)
    }
  }
  return result
})
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const usedDefaultSlot = computed(() => !!slots.default)
</script>

<template>
<template v-if="usedDefaultSlot">
  <template v-for="(c, _) in slots.default()" :key="_">
    <YFieldProxyComponent
      :label="props.label"
      :placeholder="props.placeholder"
      :component="c"
      :modelNames="_effectModels"
    />
  </template>
</template>
</template>
