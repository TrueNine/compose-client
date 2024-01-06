import {useFetch} from '@vueuse/core'
import type {Address} from '@compose/api-types'

export const AddressApi = {
  findProvinces() {
    return useFetch('http://localhost:8080/v1/address/provinces', {immediate: false}).get().json<Address[]>()
  },
  findDirectChildrenByCode(code: string = '00') {
    return useFetch(`http://localhost:8080/v1/address/it/${code}`, {immediate: false}).get().json<Address[]>()
  }
}
