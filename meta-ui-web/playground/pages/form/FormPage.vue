<script setup lang="ts">
import {object} from 'yup'
import type {dynamic} from '@compose/api-types'

const schema = [object().shape({}), object().shape({}), object().shape({})]
const mv = ref()
const updMv = () => {
  mv.value = {
    x: 1,
    y: 2,
    z: 3
  }
}
const submit = (y: dynamic) => {
  console.log('submit')
  console.log(y)
}
const step = ref(2)
</script>

<template>
  <div>
    <h1>{{ mv }}</h1>
    <VBtn @click="updMv">updMV</VBtn>
    <YForm v-model:step="step" v-model="mv" :schema="schema" @next="submit" @submit="submit">
      <YField name="x">
        <template #input="p">
          <h1>{{ p }}</h1>
          <YTestDefaultValid v-bind="p" />
        </template>
      </YField>
      <YField name="y">1</YField>
      <YField name="z">2</YField>
      <VBtn type="submit">submit</VBtn>
    </YForm>
  </div>
</template>
