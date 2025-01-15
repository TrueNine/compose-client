<script setup lang="ts">
import {object} from 'yup'
import type {dynamic} from '@compose/api-types'
import YForm from '@/form/YForm.vue'

const schema = object().shape({})
const mv = ref<{files: File[]}>({files: []})
console.log('page is readonly', isReadonly(mv.value.files))
const submit = (f: dynamic) => {
  console.log('page submit', f)
}
setTimeout(() => {
  console.log('mv is readonly', isReadonly(mv.value.files))
  mv.value = {
    files: [new File(['1'], '1'), new File(['1'], '2')]
  }
}, 1000)
</script>

<template>
  <YForm class="w-50vw p-4" :modelValue="mv" :schema="schema" @next="submit" @submit="submit">
    <YField name="files[0]">
      <VFileInput />
    </YField>
    <YField name="files[1]">
      <VFileInput />
    </YField>
    <VBtn type="submit" block color="primary">SUBMIT</VBtn>
  </YForm>
</template>
