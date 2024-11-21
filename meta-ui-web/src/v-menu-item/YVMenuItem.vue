<script setup lang="ts">
import type {bool, late, RouteOption} from '@compose/api-types'
import {isNonNil} from '@compose/api-model'

import YVMenuItem from '@/v-menu-item/YVMenuItem.vue'
import type {YVMenuItemProps, YVMenuItemSlots} from '@/v-menu-item/index'

const props = withDefaults(defineProps<YVMenuItemProps>(), {
  pathPrefix: '',
  routeMode: false
})

const _route = computed(() => props.route)
const _value = computed(() => {
  const parentPath = props.parentPath || ``
  const prefix = props.pathPrefix || ``
  const value = props.route.uri || ``
  return `/${prefix}/${parentPath}/${value}`.replace(/\/+/g, '/')
})

const _menuIconClass = computed(() => {
  return _route.value.iconClass || _route.value.iconName || 'i-mdi-menu-open'
})
const _title = computed(() => {
  return _route.value.name || _route.value.uri || ''
})
const _hidden = computed(() => !!props.route.hidden)

function isSub(opt: RouteOption): bool {
  return isNonNil(opt?.sub)
}

defineSlots<YVMenuItemSlots>()

const router = useRouter()
async function routeTo() {
  if (props.routeMode && !props.route?.disabled && router) await router.push(_value.value)
}

function urlJoin(...args: late<string>[]) {
  return args?.filter(Boolean).join('/').replace(/\/+/g, '/')
}
</script>

<template>
  <template v-if="isSub(_route)">
    <VListGroup color="primary" :value="_value">
      <template #activator="{props: p}">
        <VListItem :disabled="route.disabled" color="primary" v-bind="p">
          <template #prepend>
            <slot :hidden="_hidden" :title="_title" :value="_value" :subItem="false" name="icon" :iconName="_menuIconClass">
              <YIco :class="[_menuIconClass]" />
            </slot>
          </template>
          <VListItemTitle px1>{{ _title }}</VListItemTitle>
        </VListItem>
      </template>
      <YVMenuItem
        v-for="(r, i) in _route.sub"
        :key="i"
        :routeMode="props.routeMode"
        :pathPrefix="props.pathPrefix"
        :subMenu="true"
        :parentPath="urlJoin($props.parentPath, _route.uri)"
        :route="r"
      />
    </VListGroup>
  </template>

  <template v-else-if="!props.route.hidden">
    <VListItem :disabled="route.disabled" color="primary" nav density="compact" :value="_value" @click="routeTo">
      <template #prepend>
        <slot :hidden="_hidden" :title="_title" :value="_value" :subItem="false" name="icon" :iconName="_menuIconClass">
          <YIco :class="[_menuIconClass]" />
        </slot>
      </template>
      <template #append>
        <template v-if="props.route.tags">
          <VChip v-for="(tag, i) in props.route.tags" :key="i" variant="text" color="primary">{{ tag }}</VChip>
        </template>
      </template>
      <VListItemTitle>{{ _title }}</VListItemTitle>
    </VListItem>
  </template>
</template>
