<script lang="ts" setup>
import type {Int, LateNull, SerialCode} from '@compose/compose-types'
import {des} from '@compose/api-model'

import {defaultSelects, type Emits, type IComponentAddr, type Props, type SelectValue} from './index'

const clipCode = (code: string, level: Int) => {
  switch (level) {
    case 1:
      return code.slice(0, 2)
    case 2:
      return code.slice(0, 4)
    case 3:
      return code.slice(0, 6)
    case 4:
      return code.slice(0, 9)
    case 5:
      return code.slice(0, 12)
    default:
      return code
  }
}

const props = withDefaults(defineProps<Props>(), {
  fullPath: '',
  adCode: '',
  showAdCode: false,
  showFullPath: true,
  level: 'district',
  selectedLevel: 0,
  findProvinces: () => [],
  notFoundProvinces: () => [],
  findCities: () => [],
  findDistricts: () => [],
  findTowns: () => [],
  findVillages: () => []
})
const emits = defineEmits<Emits>()

// 地址缓存
const addressCache = ref<Record<SerialCode, IComponentAddr[]>>({})
const saveCache = (code: SerialCode, data: IComponentAddr[]) => (addressCache.value[code] = data)
const getCache = (code?: SerialCode) => (code ? addressCache.value[code] : undefined)

const provinces = ref<LateNull<IComponentAddr>[]>([])
const cities = ref<LateNull<IComponentAddr>[]>([])
const districts = ref<LateNull<IComponentAddr>[]>([])
const towns = ref<LateNull<IComponentAddr>[]>([])
const villages = ref<LateNull<IComponentAddr>[]>([])

const defaultSelected = des(defaultSelects)
const selected = ref<SelectValue>(des(defaultSelects))

const emitsFullPath = computed({
  get: () => props.fullPath,
  set: v => emits('update:fullPath', v)
})

const emitsAdCode = computed({
  get: () => props.adCode,
  set: v => emits('update:adCode', v)
})
const emitsLevel = computed({
  get: () => props.selectedLevel,
  set: v => emits('update:selectedLevel', v)
})

const sortFn = (a: LateNull<IComponentAddr>, b: LateNull<IComponentAddr>) => {
  if (a!.code < b!.code) return -1
  if (a!.code > b!.code) return 1
  return 0
}

watch(
  () => selected.value.province,
  async v => {
    if (v && v.code !== '') {
      const cacheable = getCache(v?.code)
      if (cacheable) cities.value = cacheable
      else {
        cities.value = (await props.findCities(v))?.sort(sortFn) ?? []
        saveCache(
          v.code,
          cities.value.map(e => e!)
        )
      }
      emitsLevel.value = 1
      emitsAdCode.value = clipCode(v.code, 1)
      emitsFullPath.value = v.name
    }
    selected.value.city = defaultSelected.city
  }
)

watch(
  () => selected.value.city,
  async v => {
    if (v && v.code !== '') {
      const cacheable = getCache(v?.code)
      if (cacheable) districts.value = cacheable
      else {
        districts.value = (await props.findDistricts(v))?.sort(sortFn) ?? []
        saveCache(
          v.code,
          districts.value.map(e => e!)
        )
      }
      emitsLevel.value = 2
      emitsAdCode.value = clipCode(v.code, 2)
      emitsFullPath.value = selected.value.province!.name + v.name
    }
    selected.value.district = defaultSelected.district
  }
)

watch(
  () => selected.value.district,
  async v => {
    if (v && v.code !== '') {
      const cacheable = getCache(v?.code)
      if (cacheable) towns.value = cacheable
      else {
        towns.value = (await props.findTowns(v))?.sort(sortFn) ?? []
        saveCache(
          v.code,
          towns.value.map(e => e!)
        )
      }
      emitsLevel.value = 3
      emitsAdCode.value = clipCode(v.code, 3)
      emitsFullPath.value = selected.value.province!.name + selected.value.city!.name + v.name
    }
    selected.value.town = defaultSelected.town
  }
)

watch(
  () => selected.value.town,
  async v => {
    if (v && v.code !== '') {
      const cacheable = getCache(v?.code)
      if (cacheable) villages.value = cacheable
      else {
        villages.value = (await props.findVillages(v))?.sort(sortFn) ?? []
        saveCache(
          v.code,
          villages.value.map(e => e!)
        )
      }
      emitsLevel.value = 4
      emitsAdCode.value = clipCode(v.code, 4)
      emitsFullPath.value = selected.value.province!.name + selected.value.city!.name + selected.value.district!.name + v.name
    }
    selected.value.village = defaultSelected.village
  }
)

watch(
  () => selected.value.village,
  v => {
    if (v && v.code !== '') {
      emitsLevel.value = 5
      emitsAdCode.value = clipCode(v.code, 5)
      emitsFullPath.value = selected.value.province!.name + selected.value.city!.name + selected.value.district!.name + selected.value.town!.name + v.name
    }
  }
)

const levelSerial = computed(() => {
  return props.level === 'province' ? 1 : props.level === 'city' ? 2 : props.level === 'town' ? 4 : props.level === 'village' ? 5 : 3
})

const isSelectCity = computed(() => selected.value.province?.code !== '' && levelSerial.value >= 2 && !selected.value.province?.leaf)
const isSelectDistrict = computed(() => selected.value.city?.code !== '' && levelSerial.value >= 3 && !selected.value.city?.leaf)
const isSelectTown = computed(() => selected.value.district?.code !== '' && levelSerial.value >= 4 && !selected.value.district?.leaf)
const isSelectVillage = computed(() => selected.value.town?.code !== '' && levelSerial.value >= 5 && !selected.value.town?.leaf)

onMounted(async () => {
  provinces.value = (await props.findProvinces()) ?? []
  provinces.value.sort((a, b) => {
    return a!.code.localeCompare(b!.code)
  })
})

const copy = (str: string) => {
  const clip = window.navigator.clipboard
  clip.writeText(str)
}

const copyAdCode = () => copy(props.adCode!)
const copyFullPath = () => copy(props.fullPath!)
</script>

<template>
  <VCard>
    <VCardText>
      <slot v-if="props.showFullPath" name="full-path" :ad-code="adCode" :full-path="fullPath">
        <div min-h-10 p-1>
          <slot v-if="showAdCode" name="ad-code" :ad-code="adCode">
            <div v-if="adCode" flex items-center>
              <div>{{ props.adCode }}</div>
              <VTooltip text="复制地址代码">
                <template #activator="{props: e}">
                  <div v-bind="e" pl-2 text-6 i-mdi-file @click="copyAdCode" />
                </template>
              </VTooltip>
            </div>
          </slot>

          <slot name="full-path" :full-path="fullPath">
            <div v-if="fullPath" flex items-center>
              <div>{{ props.fullPath }}</div>
              <VTooltip text="复制地址">
                <template #activator="{props: e}">
                  <div v-bind="e" pl-2 text-6 i-mdi-file @click="copyFullPath" />
                </template>
              </VTooltip>
            </div>
          </slot>
        </div>
      </slot>
    </VCardText>

    <VCardText>
      <section>
        <slot name="default" :selected="selected">
          <VRow :dense="true">
            <slot name="select-province" :selected-province="selected.province" :provinces="provinces">
              <VCol cols="6" sm="6" md="3">
                <VSelect
                  v-model="selected.province"
                  :return-object="true"
                  :persistent-hint="true"
                  :label="defaultSelected.province.name"
                  :items="provinces"
                  item-title="name"
                  item-value="code"
                />
              </VCol>
            </slot>

            <slot v-if="isSelectCity" name="select-cities" :selected-city="selected.city" :cities="cities">
              <VCol cols="6" sm="6" md="3">
                <VSelect
                  v-model="selected.city"
                  :return-object="true"
                  :persistent-hint="true"
                  :label="defaultSelected.city.name"
                  :items="cities"
                  item-title="name"
                  item-value="code"
                />
              </VCol>
            </slot>

            <slot v-if="isSelectDistrict" name="select-district" :selected-district="selected.district" :districts="districts">
              <VCol cols="6" sm="6" md="3">
                <VSelect
                  v-model="selected.district"
                  :return-object="true"
                  :persistent-hint="true"
                  :label="defaultSelected.district.name"
                  :items="districts"
                  item-title="name"
                  item-value="code"
                />
              </VCol>
            </slot>

            <slot v-if="isSelectTown" name="select-town" :selected-town="selected.town" :towns="towns">
              <VCol cols="6" sm="6" md="3">
                <VSelect
                  v-model="selected.town"
                  :return-object="true"
                  :persistent-hint="true"
                  :label="defaultSelected.town.name"
                  :items="towns"
                  item-title="name"
                  item-value="code"
                />
              </VCol>
            </slot>

            <slot v-if="isSelectVillage" name="select-village" :selected-village="selected.village" :villages="villages">
              <VCol cols="6" sm="6" md="4">
                <VSelect
                  v-model="selected.village"
                  :return-object="true"
                  :persistent-hint="true"
                  :label="defaultSelected.village.name"
                  :items="villages"
                  item-title="name"
                  item-value="code"
                />
              </VCol>
            </slot>
          </VRow>
        </slot>
      </section>
    </VCardText>
  </VCard>
</template>
