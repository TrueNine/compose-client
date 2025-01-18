<script setup lang="ts">
import {array, object, string} from 'yup'
import type {dynamic} from '@compose/api-types'

const schema = object({
  files: array().of(string())
})
const submit = (f: dynamic) => {
  console.log('page submit', JSON.stringify(f))
}
const modelData = ref()
function set0() {
  modelData.value.files[0] = '233'
}
</script>

<template>
  {{ modelData }}
  <YForm v-model="modelData" class="w-50vw p-4" :schema="schema" @submit="submit">
    <YFieldMessage name="files" />
    <YField name="files[0]">
      <VTextField />
    </YField>
    <YField name="a.b">
      <VTextField />
    </YField>
    <YField name="files[1]">
      <VTextField />
    </YField>
    <VBtn @click="set0">set 0</VBtn>
    <VBtn type="submit" block color="primary">SUBMIT</VBtn>
  </YForm>
</template>
