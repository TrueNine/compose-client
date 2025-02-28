<script setup lang="ts">
import type { dynamic } from '@compose/api-types'

import * as z from 'yup'

const schema = z.object({
  files: z.array(z.string()),
  a: z.object({
    b: z.string().required(),
  }),
})

function submit(s: dynamic) {
  console.log(s)
}
function error(e: dynamic) {
  console.error(e)
}
</script>

<template>
  <YForm class="w-50vw p-4" :schema="schema" @error="error" @submit="submit">
    <YField name="files[0]">
      <VTextField />
    </YField>
    <YField name="files[1]">
      <VTextField />
    </YField>
    <YField name="a.b">
      <VTextField />
    </YField>
    <VBtn type="submit" block color="primary">
      SUBMIT
    </VBtn>
  </YForm>
</template>
