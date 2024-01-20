import type {dynamic} from '@compose/api-types'
import {ref, computed} from 'vue'

// <P extends object, K extends keyof P, Name extends string>(props: P, key?: K, emit?: (name: Name, ...args: any[]) => void, options?: UseVModelOptions<P[K], false>): WritableComputedRef<P[K]>;

/**
 * @deprecated 已过时，请使用 useVModel
 * @param props
 * @param key
 * @param emit
 * @returns
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
