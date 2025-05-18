<script lang="ts" setup>
import type { nil } from '@compose/types'
import type { IComponentAddr, YAddressSelectEmits, YVAddressSelectProps, YVAddressSelectSelectValue } from '.'

import { AddressUtils, des } from '@compose/shared'
import { reactive } from 'vue'
import {
  clipCode,
  getAdCodeLevel,

  YVAddressSelectDefaultSelects,

} from '.'

const props = withDefaults(defineProps<YVAddressSelectProps>(), {
  selectedLevel: 0,
  fullPath: '',
  adCode: '',
  showAdCode: false,
  showFullPath: false,
  level: 'district',
  findCities: void 0,
  findTowns: void 0,
  findProvinces: void 0,
  findDistricts: void 0,
  findVillages: void 0,
  findByCode: void 0,
})

const emits = defineEmits<YAddressSelectEmits>()

function pad(code: string) {
  return code.padEnd(12, '0')
}

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
const addressCache = ref<Record<string, IComponentAddr[]>>({})
const saveCache = (code: string, data: IComponentAddr[]) => (addressCache.value[code] = data)
const getCache = (code?: string) => (code ? addressCache.value[code] : void 0)

const addressCacheData = reactive<Record<string, IComponentAddr[]>>({
  province: [],
  city: [],
  district: [],
  town: [],
  village: [],
})

const defaultSelected = des(YVAddressSelectDefaultSelects)
const selected = ref<YVAddressSelectSelectValue>(des(YVAddressSelectDefaultSelects))

const _fullPath = useVModel(props, 'fullPath', emits, { passive: true })
const _adCode = useVModel(props, 'adCode', emits, { passive: true })
const _selectedLevel = useVModel(props, 'selectedLevel', emits, { passive: true, defaultValue: 0 })

function sortFn(a?: nil<IComponentAddr>, b?: nil<IComponentAddr>) {
  if (a === null || a === void 0) {
    return 1
  }
  if (b === null || b === void 0) {
    return -1
  }
  if (a.code < b.code) {
    return -1
  }
  if (a.code > b.code) {
    return 1
  }
  return 0
}

const checkList = [2, 4, 6, 9, 12]
const keyNames: (keyof YVAddressSelectSelectValue)[] = ['province', 'city', 'district', 'town', 'village']
const fnNames = ['findProvinces', 'findCities', 'findDistricts', 'findTowns', 'findVillages', 'findByCode']
const loading = ref<boolean>(false)

async function cacheAndUpdate(code: string) {
  loading.value = true
  if (code.length < 2 || code.length > 12) {
    return
  }
  if (!checkList.includes(code.length)) {
    return
  }
  const padCode = pad(code)
  const level = getAdCodeLevel(code)

  const max = level - 1
  const curIdx = max - 1
  const currentFnKey = (fnNames[max] ?? fnNames[5]) as 'findProvinces' | 'findCities' | 'findDistricts' | 'findTowns' | 'findVillages' | 'findByCode'
  const currentKey = keyNames[max]
  const prevKey = keyNames[curIdx]

  const cache = getCache(padCode)
  const pt = addressCacheData[prevKey].find((e) => pad(e.code) === padCode)

  // ready next addresses
  let fullPath = ''
  if (level < emitsDeepLevel.value) {
    addressCacheData[currentKey]
      = cache
        ?? (await props[currentFnKey]?.(pt))
          ?.sort(sortFn)
          .filter((e) => e != null)
          .map((e) => e)
          ?? []

    saveCache(
      padCode,
      addressCacheData[currentKey].map((e) => e),
    )
  }

  // append fullPath
  for (let i = 0; i < max; i++) {
    const key = keyNames[i]
    const item = selected.value[key]
    if (item?.name) {
      fullPath += item.name
    }
  }

  selected.value[prevKey] = addressCacheData[prevKey].find((e) => pad(e.code) === padCode)
  selected.value[currentKey] = defaultSelected[currentKey]

  _fullPath.value = fullPath
  _selectedLevel.value = level
  _adCode.value = clipCode(code, level - 1)
  loading.value = false
}

watch(
  () => selected.value.province,
  async (v) => {
    if (v && v.code !== '') {
      await cacheAndUpdate(v.code)
    }
  },
)

watch(
  () => selected.value.city,
  async (v) => {
    if (v && v.code !== '') {
      await cacheAndUpdate(v.code)
    }
  },
)

watch(
  () => selected.value.district,
  async (v) => {
    if (v && v.code !== '' && !loading.value) {
      await cacheAndUpdate(v.code)
    }
  },
)

watch(
  () => selected.value.town,
  async (v) => {
    if (v && v.code !== '') {
      await cacheAndUpdate(v.code)
    }
  },
)

watch(
  () => selected.value.village,
  async (v) => {
    if (v && v.code !== '') {
      await cacheAndUpdate(v.code)
    }
  },
)
const codingLoad = ref(false)

/**
 * ## 监听代码触发器
 * @param code adCode
 */
async function watchChangeCode(code: string) {
  if (code && !loading.value && !codingLoad.value) {
    await loadCode(code)
  } else {
    if (!loading.value && !codingLoad.value) {
      _selectedLevel.value = 0
      _fullPath.value = ''
      selected.value.province = defaultSelected.province
    }
  }
}

onMounted(async () => {
  addressCacheData.province = []

  const r = await props.findProvinces?.() ?? []

  addressCacheData.province = r.filter((e): e is IComponentAddr => Boolean(e))

  addressCacheData.province.sort((a, b) => {
    return a.code.localeCompare(b.code)
  })
  await watchChangeCode(props.adCode)
})

async function loadCode(code: string) {
  codingLoad.value = true
  let appendCode = ''
  const s = new AddressUtils(code).serialArray
  for (const e of s) {
    appendCode += e
    await cacheAndUpdate(appendCode)
  }
  codingLoad.value = false
}

watchThrottled(() => props.adCode, watchChangeCode)
</script>

<template>
<VCard>
  <div p1>
    <slot name="default" :selected="selected">
      <VRow :dense="true">
        <VCol cols="6">
          <VSelect
            v-model="selected.province"
            :clearable="true"
            :returnObject="true"
            :persistentHint="true"
            :label="defaultSelected.province.name"
            :items="addressCacheData.province"
            itemTitle="name"
            itemValue="code"
          />
        </VCol>

        <Transition name="el-fade-in-linear">
          <VCol v-if="_selectedLevel > 1 && emitsDeepLevel > 2" cols="6" sm="6">
            <VSelect
              v-model="selected.city"
              clearable
              :returnObject="true"
              :persistentHint="true"
              :label="defaultSelected.city.name"
              :items="addressCacheData.city"
              itemTitle="name"
              itemValue="code"
            />
          </VCol>
        </Transition>

        <Transition name="el-fade-in-linear">
          <VCol v-if="_selectedLevel > 2 && emitsDeepLevel > 3" cols="6" sm="6">
            <VSelect
              v-model="selected.district"
              clearable
              :returnObject="true"
              :persistentHint="true"
              :label="defaultSelected.district.name"
              :items="addressCacheData.district"
              itemTitle="name"
              itemValue="code"
            />
          </VCol>
        </Transition>

        <Transition name="el-fade-in-linear">
          <VCol v-if="_selectedLevel > 3 && emitsDeepLevel > 4" cols="6" sm="6">
            <VSelect
              v-model="selected.town"
              clearable
              :returnObject="true"
              :persistentHint="true"
              :label="defaultSelected.town.name"
              :items="addressCacheData.town"
              itemTitle="name"
              itemValue="code"
            />
          </VCol>
        </Transition>

        <Transition name="el-fade-in-linear">
          <VCol v-if="_selectedLevel > 4 && emitsDeepLevel > 5" cols="6" sm="6">
            <VSelect
              v-model="selected.village"
              clearable
              :returnObject="true"
              :persistentHint="true"
              :label="defaultSelected.village.name"
              :items="addressCacheData.village"
              itemTitle="name"
              itemValue="code"
            />
          </VCol>
        </Transition>
      </VRow>
    </slot>
  </div>
</VCard>
</template>
