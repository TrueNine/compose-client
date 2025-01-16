<script setup lang="ts">
import {array, object, string} from 'yup'
import type {dynamic} from '@compose/api-types'

const schema = object({
  files: array()
    .of(
      object({
        type: string().required().oneOf(['application/pdf', 'application/png'])
      })
    )
    .max(1)
})
const submit = (f: dynamic) => {
  console.log('page submit', f)
}
</script>

<template>
  <YForm class="w-50vw p-4" :schema="schema" @submit="submit">
    <YFieldMessage name="files" />
    <YField name="files[0]">
      <VFileInput />
    </YField>
    <YField name="files[1]">
      <VFileInput />
    </YField>
    <VBtn type="submit" block color="primary">SUBMIT</VBtn>
  </YForm>
</template>
