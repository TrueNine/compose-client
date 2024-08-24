<script setup lang="ts">
import {object} from 'yup'

console.log(1)
const schema = object().shape({})
</script>

<template>
  <div>
    <YForm :schema="schema">
      <YField name="y">
        <template #input="p">
          <h1>{{ p }}</h1>
          <YTestDefaultValid v-bind="p" />
        </template>
      </YField>
    </YForm>
  </div>
</template>
