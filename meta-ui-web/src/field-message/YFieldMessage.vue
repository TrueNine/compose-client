<script setup lang="ts">
import type { YFieldMessageEmits, YFieldMessageProps } from './index'
import { ErrorMessage as VeeErrorMessage } from 'vee-validate'

const props = withDefaults(defineProps<YFieldMessageProps>(), {
  name: '',
})
const emits = defineEmits<YFieldMessageEmits>()
const _name = useVModel(props, 'name', emits, { passive: true })
</script>

<template>
  <VeeErrorMessage :name="_name">
    <template #default="{ message }">
      <slot name="default" :active="!!message" :message="message">
        <VMessages :active="!!message" :messages="message" color="error" />
      </slot>
    </template>
  </VeeErrorMessage>
</template>
