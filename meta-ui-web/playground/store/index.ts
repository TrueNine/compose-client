import { createPinia, defineStore } from 'pinia'

const PlaygroundPinia = createPinia()

const usePlaygroundStore = defineStore('playground', () => {
  const authed = ref(false)
  const anon = ref(false)
  const permissions = ref<string[]>([])
  const roles = ref<string[]>([])

  return {
    authed,
    anon,
    permissions,
    roles,
  }
})
export { PlaygroundPinia as Pinia, usePlaygroundStore }

export default PlaygroundPinia
