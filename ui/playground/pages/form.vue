<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  age: z.number(),
  tags: z.array(
    z.string().nonempty(),
  ),
})
  type Schema = z.infer<typeof schema>
function onSubmit(data: Schema) {
  console.error(data)
}
function onError(error: unknown) {
  console.error(error)
}
const data = ref<Schema>()
</script>

<template>
<div>
  {{ data }}
</div>
<div class="w-full flex justify-center">
  <YForm v-model="data" class="mx-auto w-50vw py-12" :schema="schema" @error="onError" @submit="onSubmit">
    <YField name="name" label="姓名">
      <VTextField />
    </YField>
    <YField name="age" label="年龄">
      <VTextField />
    </YField>
    <YField name="tags" label="标签">
      <VTextField />
    </YField>
    <div class="flex justify-end">
      <VBtn color="primary" type="submit">
        提交
      </VBtn>
    </div>
  </YForm>
</div>
</template>
