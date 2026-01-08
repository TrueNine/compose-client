<script setup lang="ts">
import type {YVMenuEmits, YVMenuProps} from './index'

const props = withDefaults(defineProps<YVMenuProps>(), {
  pathPrefix: '',
  opened: true,
  railWidth: 50,
})
const emits = defineEmits<YVMenuEmits>()

const _opened = useVModel(props, 'opened', emits, {passive: true})
const _routes = useVModel(props, 'routes', emits, {passive: true})
const _value = useVModel(props, 'value', emits, {passive: true})

const _v = computed({
  get: () => [_value.value],
  set: v => _value.value = v[0],
})
</script>

<template>
<VNavigationDrawer v-model="_opened" :railWidth="props.railWidth" rail expandOnHover>
  <VList v-model:selected="_v" density="compact" nav>
    <template v-for="(route, _) in _routes" :key="_">
      <YVMenuItem :routeMode="props.routeMode" :pathPrefix="props.pathPrefix" :route="route" />
    </template>
  </VList>
</VNavigationDrawer>
</template>
