<script setup lang="ts">
import {object} from 'yup'
import type {dynamic} from '@compose/api-types'
import YForm from '@/form/YForm.vue'

const schema = object().shape({})
const mv = ref()

const submit = (f: dynamic) => {
  console.log('page submit')
  console.log(f)
}
</script>

<template>
  <YForm v-model="mv" :schema="schema" @next="submit" @submit="submit">
    <YField name="a.b">
      <template #input="p">
        <VTextField v-bind="p" />
      </template>
    </YField>
    <YField name="x">
      <template #input="p">
        <VTextField v-bind="p" />
      </template>
    </YField>
    <YField name="y">
      <template #input="p">
        <VTextField v-bind="p" />
      </template>
    </YField>
    <YField name="z">
      <template #input="p">
        <VTextField v-bind="p" />
      </template>
    </YField>
    <div>
      <div>
        <VBtn type="submit">submit</VBtn>
      </div>
    </div>
  </YForm>
</template>
