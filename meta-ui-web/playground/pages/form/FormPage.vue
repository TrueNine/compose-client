<script setup lang="ts">
import type { dynamic } from '@compose/api-types'

import * as z from 'zod'

interface Props {
  modelValue?: dynamic
}
const props = withDefaults(
  defineProps<Props>(),
  {
    modelValue: void 0,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', v: dynamic): void
}>()
const _modelValue = useVModel(props, 'modelValue', emit, { passive: true })

const schema = z.object({
  files: z.array(z.string()),
  a: z.object({
    b: z.string().default('23344'),
  }),
}).optional().refine(v => (v?.files.length ?? 0) > 0, '123123123')

function submit(s: dynamic) {
  console.error({ submit: s })
}
function error(e: dynamic) {
  console.error(e)
}
</script>

<template>
  <YForm v-model="_modelValue" class="w-50vw p-4" :schema="schema" @error="error" @submit="submit">
    <div>
      {{ _modelValue }}
    </div>
    <YField name="files[0]">
      <VTextField />
    </YField>
    <YField name="files[1]">
      <VTextField />
    </YField>
    <YField name="a.b">
      <VTextField />
    </YField>
    <template #submit="e">
      {{ e }}
    </template>
    <VBtn type="submit" :block="true" color="primary">
      SUBMIT
    </VBtn>
  </YForm>
</template>
