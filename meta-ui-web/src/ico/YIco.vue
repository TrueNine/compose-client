<script setup lang="tsx">
import type {YIcoProps} from './index'

const props = withDefaults(defineProps<YIcoProps>(), {
  tag: 'i'
})
</script>

<template>
  <Component :is="props.tag" class="text-6 inline-block">
    <slot name="default" />
  </Component>
</template>
