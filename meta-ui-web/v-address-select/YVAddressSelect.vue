<script lang="ts" setup>
import type {LateNull, SerialCode} from '@compose/compose-types'
import {des} from '@compose/api-model'

import {clipCode, defaultSelects, type Emits, getAdCodeLevel, type IComponentAddr, type Props, type SelectValue} from './index'

const pad = (code: string) => {
  return code.padEnd(12, '0')
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

const datas = reactive<Record<string, IComponentAddr[]>>({
  province: [],
  city: [],
  district: [],
  town: [],
  village: []
})

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

  // ready next addresses
  datas[currentKey] =
    cache ??
    (await props[currentFnKey](pt))
      ?.sort(sortFn)
      .filter(e => e != null)
      .map(e => e!) ??
    []
  saveCache(
    padCode,
    datas[currentKey].map(e => e!)
  )

  let fullPath = ''
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
  v => {
    if (v && v.code !== '') {
      emitsLevel.value = 5
      emitsAdCode.value = clipCode(v.code, 5)
      emitsFullPath.value = selected.value.province!.name + selected.value.city!.name + selected.value.district!.name + selected.value.town!.name + v.name
    }
  }
)

onMounted(async () => {
  datas['province'] = ((await props.findProvinces()) ?? []).map(e => e!)
  datas.province.sort((a, b) => {
    return a!.code.localeCompare(b!.code)
  })
})

const copy = (str: string) => {
  const clip = window.navigator.clipboard
  clip.writeText(str)
}

watch(
  () => emitsAdCode.value,
  v => {
    if (v) {
      console.log(v)
      cacheAndUpdate(v)
    }
  }
)

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
            <slot name="select-province" :selected-province="selected.province" :provinces="datas.province">
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
            </slot>

            <Transition name="el-fade-in-linear">
              <slot v-if="emitsLevel > 1" name="select-cities" :selected-city="selected.city" :cities="datas.city">
                <VCol cols="6" sm="6" md="3">
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
              </slot>
            </Transition>
            <Transition name="el-fade-in-linear">
              <slot v-if="emitsLevel > 2" name="select-district" :selected-district="selected.district" :districts="datas.district">
                <VCol cols="6" sm="6" md="3">
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
              </slot>
            </Transition>

            <Transition name="el-fade-in-linear">
              <slot v-if="emitsLevel > 3" name="select-town" :selected-town="selected.town" :towns="datas.town">
                <VCol cols="6" sm="6" md="3">
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
              </slot>
            </Transition>

            <Transition name="el-fade-in-linear">
              <slot v-if="emitsLevel > 4" name="select-village" :selected-village="selected.village" :villages="datas.village">
                <VCol cols="6" sm="6" md="4">
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
              </slot>
            </Transition>
          </VRow>
        </slot>
      </section>
    </VCardText>
  </VCard>
</template>
