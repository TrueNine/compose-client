<script setup lang="ts">
import {AddressApi} from '../../api/AddressApi'

import type {IComponentAddr} from '@/v-address-select'

const {data, execute} = AddressApi.findProvinces()
const findProvinces = async () => {
  await execute()
  return data.value
}

const findCities = async (code?: IComponentAddr) => {
  const {data, execute} = AddressApi.findDirectChildrenByCode(code?.code)
  await execute()
  return data.value
}
const code = ref<string>('')
const aab = ref('')
code.value = '433127'
setTimeout(() => {
  code.value = '4331'
}, 3000)
</script>
<template>
  {{ aab + 1 }}
  {{ code + 1 }}
  <VTextField v-model="code" label="地址" />
  <YVAddressSelect
    v-model:adCode="code"
    v-model:fullPath="aab"
    level="district"
    :findDistricts="findCities"
    :findTowns="findCities"
    :findVillages="findCities"
    :findCities="findCities"
    :findProvinces="findProvinces"
  />
</template>
