<script setup lang="ts">
import type {LateNull} from '@compose/api-types'

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
const aab = ref('')
</script>
<template>
  <VTextField v-model="code" label="地址" />
  <YVAddressSelect
    v-model:ad-code="code"
    level="district"
    :find-districts="findCities"
    :find-towns="findCities"
    :find-villages="findCities"
    :find-cities="findCities"
    :find-provinces="findProvinces"
    @update:full-path="(e: string) => (aab = e)"
  />
</template>
