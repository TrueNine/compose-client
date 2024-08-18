import type {dynamic} from '@compose/api-types'
import {ref, computed} from 'vue'

/**
 * @deprecated 请迁移到 [@compose/extension] 包
 * @see [@compose/extensions] 此包已迁移
 */
export function useWatchVModel<P extends object, K extends keyof P, Name extends string>(props: P, key: K, emit: (name: Name, ...args: dynamic[]) => void) {
  const pName = `update:${key as string}` as Name

  const internalValue = ref(props[key])
  const modelValue = computed({
    get: () => internalValue.value,
    set: value => {
      internalValue.value = value
      emit(pName, value)
    }
  })
  return {mv: modelValue, ref: internalValue}
}
