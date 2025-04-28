<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  age: z.string().transform((val) => Number(val)),
  tags: z.array(
    z.string().nonempty(),
  ),
  input: z.object({
    a: z.string().optional(),
    b: z.string().optional(),
    c: z.string().optional(),
  }),
})

type Schema = z.infer<typeof schema>
function onSubmit(data: Schema) {
  console.error(data)
}
function onError(error: unknown) {
  console.error(error)
}
const data = ref<Schema>({
  name: '',
  age: '',
  tags: [],
} as unknown as Schema)
</script>

<template>
<div class="w-full flex flex-col items-center justify-center py-22">
  <VCard class="w-50vw">
    <VCardTitle>
      表单数据
    </VCardTitle>
    <VCardText>
      {{ data }}
    </VCardText>
  </VCard>
  <YForm v-model="data" class="mx-auto w-50vw py-12" :schema="schema" @error="onError" @submit="onSubmit">
    <YField
      :name="{
        'input.a': 'x',
        'input.b': 'y',
        'input.c': 'z',
      }"
    >
      <TnInput />
    </YField>

    <YField name="name" label="姓名">
      <VTextField />
    </YField>
    <YField name="age" label="年龄">
      <VTextField />
    </YField>
    <YField name="tags" label="标签">
      <VCombobox
        :items="[]"

        chips closablechips clearable multiple
      >
        <template #selection="{ item, index }">
          <VChip
            v-if="index < 5"
            closable
            size="small"
            label
            color="primary"
            class="ma-1"
          >
            {{ item }}
          </VChip>
          <span v-else-if="index === 5" class="text-body-2 text-grey-darken-1 my-1">
            +{{ data.tags.length - 5 }} 更多
          </span>
        </template>
      </VCombobox>
    </YField>
    <div class="flex justify-end">
      <VBtn color="primary" type="submit">
        提交
      </VBtn>
    </div>
  </YForm>
</div>
</template>
