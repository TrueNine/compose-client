<script lang="ts" setup>
import type {LateNull, SerialCode} from '@compose/compose-types'
import {des} from '@compose/api-model'
import {reactive} from 'vue'

import {clipCode, defaultSelects, type Emits, getAdCodeLevel, type IComponentAddr, type Props, type SelectValue} from './index'

const pad = (code: string) => {
  return code.padEnd(12, '0')
}

const props = withDefaults(defineProps<Props>(), {
  fullPath: '',
  adCode: '',
  showAdCode: false,
  showFullPath: false,
  level: 'district',
  findProvinces: undefined,
  findCities: undefined,
  findDistricts: undefined,
  findTowns: undefined,
  findVillages: undefined
})
const emits = defineEmits<Emits>()

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

const datas = reactive<Record<string, IComponentAddr[]>>({
  province: [],
  city: [],
  district: [],
  town: [],
  village: []
})

const defaultSelected = des(defaultSelects)
const selected = ref<SelectValue>(des(defaultSelects))

const _fullPath = ref<string>('')
const emitsFullPath = computed({
  get: () => _fullPath.value,
  set: v => {
    emits('update:fullPath', v)
    _fullPath.value = v
  }
})

const _adCode = ref<string>('')
const emitsAdCode = computed({
  get: () => _adCode.value,
  set: v => {
    emits('update:adCode', v)
    _adCode.value = v
  }
})

const _selectedLevel = ref<number>(0)
const emitsLevel = computed({
  get: () => _selectedLevel.value,
  set: v => {
    emits('update:selectedLevel', v)
    _selectedLevel.value = v
  }
})

const sortFn = (a: LateNull<IComponentAddr>, b: LateNull<IComponentAddr>) => {
  if (a!.code < b!.code) return -1
  if (a!.code > b!.code) return 1
  return 0
}

const checkList = [2, 4, 6, 9, 12]
const keyNames: (keyof SelectValue)[] = ['province', 'city', 'district', 'town', 'village']
const fnNames = ['findProvinces', 'findCities', 'findDistricts', 'findTowns', 'findVillages']

async function cacheAndUpdate(code: string) {
  if (code.length < 2 || code.length > 12) return
  if (!checkList.includes(code.length)) return
  const padCode = pad(code)
  const level = getAdCodeLevel(code)

  const max = level - 1
  const curIdx = max - 1
  const currentFnKey = fnNames[max] as 'findProvinces' | 'findCities' | 'findDistricts' | 'findTowns' | 'findVillages'
  const currentKey = keyNames[max]
  const prevKey = keyNames[curIdx]
  const cache = getCache(padCode)

  const pt = datas[prevKey].find(e => pad(e!.code) === padCode)
  let fullPath = ''
  // ready next addresses
  if (level < emitsDeepLevel.value) {
    datas[currentKey] =
      cache ??
      (await props[currentFnKey]!(pt))
        ?.sort(sortFn)
        .filter(e => e != null)
        .map(e => e!) ??
      []
    saveCache(
      padCode,
      datas[currentKey].map(e => e!)
    )
  }
  for (let i = 0; i < max; i++) {
    const key = keyNames[i]
    const item = selected.value[key]
    if (item && item.name) fullPath += item.name
  }
  selected.value[prevKey] = datas[prevKey].find(e => pad(e.code) === padCode)
  selected.value[currentKey] = defaultSelected[currentKey]
  emitsFullPath.value = fullPath
  emitsLevel.value = level
  emitsAdCode.value = clipCode(code, level - 1)
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
  datas['province'] = ((await props.findProvinces!()) ?? []).map(e => e!)
  datas.province.sort((a, b) => {
    return a!.code.localeCompare(b!.code)
  })
})

const copy = (str: string) => {
  const clip = window.navigator.clipboard
  clip.writeText(str)
}

watch(
  () => props.adCode,
  v => {
    if (v) cacheAndUpdate(v)
  }
)

const copyAdCode = () => copy(emitsAdCode.value!)
const copyFullPath = () => copy(emitsFullPath.value!)
</script>

<template>
  <VCard>
    <VCardText v-if="props.showAdCode || props.showFullPath">
      <div min-h-10 p-1>
        <slot v-if="showAdCode && emitsAdCode" name="ad-code" :ad-code="emitsAdCode">
          <div v-if="emitsAdCode" flex items-center>
            <div>{{ emitsAdCode }}</div>
            <VTooltip text="复制地址代码">
              <template #activator="{props: e}">
                <div v-bind="e" pl-2 text-6 i-mdi-file @click="copyAdCode" />
              </template>
            </VTooltip>
          </div>
        </slot>

        <slot name="full-path" :full-path="emitsFullPath">
          <div v-if="emitsFullPath && props.showFullPath" flex items-center>
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
          <VCol cols="6" sm="6" md="3">
            <VSelect
              v-model="selected.province"
              :return-object="true"
              :persistent-hint="true"
              :label="defaultSelected.province.name"
              :items="datas.province"
              item-title="name"
              item-value="code"
            />
          </VCol>

          <Transition name="el-fade-in-linear">
            <VCol v-if="emitsLevel > 1 && emitsDeepLevel > 2" cols="6" sm="6" md="3">
              <VSelect
                v-model="selected.city"
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.city.name"
                :items="datas.city"
                item-title="name"
                item-value="code"
              />
            </VCol>
          </Transition>

          <Transition name="el-fade-in-linear">
            <VCol v-if="emitsLevel > 2 && emitsDeepLevel > 3" cols="6" sm="6" md="3">
              <VSelect
                v-model="selected.district"
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.district.name"
                :items="datas.district"
                item-title="name"
                item-value="code"
              />
            </VCol>
          </Transition>

          <Transition name="el-fade-in-linear">
            <VCol v-if="emitsLevel > 3 && emitsDeepLevel > 4" cols="6" sm="6" md="3">
              <VSelect
                v-model="selected.town"
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.town.name"
                :items="datas.town"
                item-title="name"
                item-value="code"
              />
            </VCol>
          </Transition>

          <Transition name="el-fade-in-linear">
            <VCol v-if="emitsLevel > 4 && emitsDeepLevel > 5" cols="6" sm="6" md="4">
              <VSelect
                v-model="selected.village"
                :return-object="true"
                :persistent-hint="true"
                :label="defaultSelected.village.name"
                :items="datas.village"
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
