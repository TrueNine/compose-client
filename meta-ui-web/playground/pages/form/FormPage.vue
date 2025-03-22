<script setup lang="tsx">
import type { dynamic } from '@compose/api-types'

import * as z from 'zod'
import PeekView from './PeekView.vue'

const schema = z.object({
  files: z.array(z.string()),
  a: z.object({
    b: z.string(),
  }),
})

function submit(s: dynamic) {
  console.error({ submit: s })
}

function error(e: dynamic) {
  console.error(e)
}
</script>

<template>
  <YForm class="w-50vw p-4" :schema="schema" @error="error" @submit="submit">
    <YField :name="['modelValue', 'other1', 'other2']">
      <PeekView />
    </YField>
    <YField label="files[0]" name="files[0]">
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
