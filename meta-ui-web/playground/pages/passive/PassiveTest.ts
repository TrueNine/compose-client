import {defineModel} from 'vue-demi'
export function usePassiveModel() {
  return defineModel('modelValue')
}
