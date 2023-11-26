<script setup lang="ts">
import type {LateNull} from '@compose/compose-types'

import {AddressApi} from '../../api/AddressApi'
import type {IComponentAddr} from '../../../v-address-select'

const {data, execute} = AddressApi.findProvinces()
const findProvinces = async () => {
  await execute()
  return data.value
}

const findCities = async (code: LateNull<IComponentAddr>) => {
  const {data, execute} = AddressApi.findDirectChildrenByCode(code!.code)
  await execute()
  return data.value
}
const code = ref<string>('')
const path = ref<string>('')
const level = ref<number>()
</script>
<template>
  {{ code }}
  {{ path }}
  {{ level }}
  <VTextField v-model="code" label="地址" />
  <YVAddressSelect
    v-model:ad-code="code"
    v-model:full-path="path"
    v-model:selected-level="level"
    level="village"
    :find-districts="findCities"
    :find-towns="findCities"
    :find-villages="findCities"
    :find-cities="findCities"
    :find-provinces="findProvinces"
  />
</template>
