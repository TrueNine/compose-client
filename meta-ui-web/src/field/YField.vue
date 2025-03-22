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
  if (!mo) {
    return {}
  }
  if (typeof mo === 'string') {
    return { [mo]: 'modelValue' }
  }
  const names = maybeArray(mo)
  const res = names.map((e, i) => {
    if (typeof e === 'string')
      return { [e]: i === 0 ? 'modelValue' : e }
    else return e
  })

  return res.reduce<Record<string, string>>((acc, cur) => {
    return { ...acc, ...cur }
  }, {})
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
