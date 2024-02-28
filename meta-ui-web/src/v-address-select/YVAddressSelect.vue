<script lang="ts" setup>
import type {LateNull, SerialCode} from '@compose/api-types'
import {CnDistrict, des} from '@compose/api-model'
import {reactive} from 'vue'

import {
  clipCode,
  getAdCodeLevel,
  type IComponentAddr,
  type YAddressSelectEmits,
  YVAddressSelectDefaultSelects,
  type YVAddressSelectProps,
  type YVAddressSelectSelectValue
} from './index'

const pad = (code: string) => {
  return code.padEnd(12, '0')
}

const props = withDefaults(defineProps<YVAddressSelectProps>(), {
  selectedLevel: 0,
  fullPath: '',
  adCode: '',
  showAdCode: false,
  showFullPath: false,
  level: 'district',
  findCities: undefined,
  findTowns: undefined,
  findProvinces: undefined,
  findDistricts: undefined,
  findVillages: undefined,
  findByCode: undefined
})
const emits = defineEmits<YAddressSelectEmits>()

const emitsDeepLevel = computed(() => {
  switch (props.level) {
    case 'province':
      return 2
    case 'city':
      return 3
    case 'town':
      return 5
    case 'village':
      return 6
    case 'district':
    default:
      return 4
  }
})

// 地址缓存
const addressCache = ref<Record<SerialCode, IComponentAddr[]>>({})
const saveCache = (code: SerialCode, data: IComponentAddr[]) => (addressCache.value[code] = data)
const getCache = (code?: SerialCode) => (code ? addressCache.value[code] : undefined)

const addressCacheData = reactive<Record<string, IComponentAddr[]>>({
  province: [],
  city: [],
  district: [],
  town: [],
  village: []
})

const defaultSelected = des(YVAddressSelectDefaultSelects)
const selected = ref<YVAddressSelectSelectValue>(des(YVAddressSelectDefaultSelects))

const _fullPath = useVModel(props, 'fullPath', emits, {passive: true})
const _adCode = useVModel(props, 'adCode', emits, {passive: true})
const _selectedLevel = useVModel(props, 'selectedLevel', emits, {passive: true, defaultValue: 0})

const sortFn = (a: LateNull<IComponentAddr>, b: LateNull<IComponentAddr>) => {
  if (a!.code < b!.code) return -1
  if (a!.code > b!.code) return 1
  return 0
}

const checkList = [2, 4, 6, 9, 12]
const keyNames: (keyof YVAddressSelectSelectValue)[] = ['province', 'city', 'district', 'town', 'village']
const fnNames = ['findProvinces', 'findCities', 'findDistricts', 'findTowns', 'findVillages', 'findByCode']

async function cacheAndUpdate(code: string) {
  if (code.length < 2 || code.length > 12) return
  if (!checkList.includes(code.length)) return
  const padCode = pad(code)
  const level = getAdCodeLevel(code)

  const max = level - 1
  const curIdx = max - 1
  const currentFnKey = (fnNames[max] ?? fnNames[5]) as 'findProvinces' | 'findCities' | 'findDistricts' | 'findTowns' | 'findVillages' | 'findByCode'
  const currentKey = keyNames[max]
  const prevKey = keyNames[curIdx]
  const cache = getCache(padCode)

  const pt = addressCacheData[prevKey].find(e => pad(e!.code) === padCode)
  let fullPath = ''
  // ready next addresses
  if (level < emitsDeepLevel.value) {
    addressCacheData[currentKey] =
      cache ??
      (await props[currentFnKey]!(pt))
        ?.sort(sortFn)
        .filter(e => e != null)
        .map(e => e!) ??
      []
    saveCache(
      padCode,
      addressCacheData[currentKey].map(e => e!)
    )
  }
  for (let i = 0; i < max; i++) {
    const key = keyNames[i]
    const item = selected.value[key]
    if (item && item.name) fullPath += item.name
  }
  selected.value[prevKey] = addressCacheData[prevKey].find(e => pad(e.code) === padCode)
  selected.value[currentKey] = defaultSelected[currentKey]
  _fullPath.value = fullPath
  _selectedLevel.value = level
  _adCode.value = clipCode(code, level - 1)
}

watch(
  () => selected.value.province,
  async v => {
    if (v && v.code !== '') await cacheAndUpdate(v.code)
  }
)

watch(
  () => selected.value.city,
  async v => {
    if (v && v.code !== '') await cacheAndUpdate(v!.code)
  }
)

watch(
  () => selected.value.district,
  async v => {
    if (v && v.code !== '') await cacheAndUpdate(v!.code)
  }
)

watch(
  () => selected.value.town,
  async v => {
    if (v && v.code !== '') await cacheAndUpdate(v!.code)
  }
)

watch(
  () => selected.value.village,
  async v => {
    if (v && v.code !== '') await cacheAndUpdate(v!.code)
  }
)

onMounted(async () => {
  addressCacheData['province'] = ((await props.findProvinces!()) ?? []).map(e => e!)
  addressCacheData.province.sort((a, b) => {
    return a!.code.localeCompare(b!.code)
  })
})

const copy = (str: string) => {
  const clip = window.navigator.clipboard
  clip.writeText(str)
}

const loading = ref<boolean>(false)

async function load(code: string) {
  loading.value = true
  let appendCode = ''
  for (const e of new CnDistrict(code).serialArray) {
    appendCode += e
    await cacheAndUpdate(appendCode)
  }
  loading.value = false
}

watch(
  () => props.adCode,
  v => {
    if (v && !loading.value) {
      load(v)
    } else {
      _fullPath.value = ''
      if (_selectedLevel.value === 2) {
        _selectedLevel.value = 0
        selected.value.province = undefined
      }
    }
  }
)

const copyAdCode = () => copy(_adCode.value!)
const copyFullPath = () => copy(_fullPath.value!)
</script>

<template>
  <VCard>
    <VCardText v-if="props.showAdCode || props.showFullPath">
      <div min-h-10 p-1>
        <slot v-if="showAdCode && _adCode" name="ad-code" :ad-code="_adCode">
          <div v-if="_adCode" flex items-center>
            <div>{{ _adCode }}</div>
            <VTooltip text="复制地址代码">
              <template #activator="{props: e}">
                <div v-bind="e" pl-2 text-6 i-mdi-file @click="copyAdCode" />
              </template>
            </VTooltip>
          </div>
        </slot>

        <slot name="full-path" :full-path="_fullPath">
          <div v-if="_fullPath && props.showFullPath" flex items-center>
            <div>{{ props.fullPath }}</div>
            <VTooltip text="复制地址">
              <template #activator="{props: e}">
                <div v-bind="e" pl-2 text-6 i-mdi-file @click="copyFullPath" />
              </template>
            </VTooltip>
          </div>
        </slot>
      </div>
    </VCardText>

    <VCardText>
      <slot name="default" :selected="selected">
        <VRow :dense="true">
          <VCol cols="6">
            <VSelect
              v-model="selected.province"
              clearable
              :return-object="true"
              :persistent-hint="true"
              :label="defaultSelected.province.name"
              :items="addressCacheData.province"
              item-title="name"
              item-value="code"
            />
          </VCol>

          <Transition name="el-fade-in-linear">
            <VCol v-if="_selectedLevel > 1 && emitsDeepLevel > 2" cols="6" sm="6">
              <VSelect
                v-model="selected.city"
                clearable
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.city.name"
                :items="addressCacheData.city"
                item-title="name"
                item-value="code"
              />
            </VCol>
          </Transition>

          <Transition name="el-fade-in-linear">
            <VCol v-if="_selectedLevel > 2 && emitsDeepLevel > 3" cols="6" sm="6">
              <VSelect
                v-model="selected.district"
                clearable
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.district.name"
                :items="addressCacheData.district"
                item-title="name"
                item-value="code"
              />
            </VCol>
          </Transition>

          <Transition name="el-fade-in-linear">
            <VCol v-if="_selectedLevel > 3 && emitsDeepLevel > 4" cols="6" sm="6">
              <VSelect
                v-model="selected.town"
                clearable
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.town.name"
                :items="addressCacheData.town"
                item-title="name"
                item-value="code"
              />
            </VCol>
          </Transition>

          <Transition name="el-fade-in-linear">
            <VCol v-if="_selectedLevel > 4 && emitsDeepLevel > 5" cols="6" sm="6">
              <VSelect
                v-model="selected.village"
                clearable
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.village.name"
                :items="addressCacheData.village"
                item-title="name"
                item-value="code"
              />
            </VCol>
          </Transition>
        </VRow>
      </slot>
    </VCardText>
  </VCard>
</template>
