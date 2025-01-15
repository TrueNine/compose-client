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
  <YForm class="w-50vw p-4" v-model="mv" :schema="schema" @next="submit" @submit="submit">
    <YField name="defaultSlot.component" label="y field props">
      <VTextField />
    </YField>

    <YField name="defaultSlot.empty"></YField>
    <YField name="defaultSlot.text"> text</YField>
    <YField name="defaultSlot.variableText">
      {{ 'text' }}
    </YField>

    <YField name="defaultSlot.div" effectModels="modelValue">
      <div class="bg-red">DIV TEXT</div>
    </YField>
    <YField name="defaultSlot.input">
      <input />
    </YField>

    <YField name="a.b">
      <VTextField />
    </YField>
    <YField name="x">
      <VTextField />
    </YField>
    <YField name="y">
      <VTextField />
    </YField>
    <YField name="z">
      <VTextField  />
    </YField>
    <div>
      <div>
        <VBtn type="submit">submit</VBtn>
      </div>
    </div>
  </YForm>
</template>
