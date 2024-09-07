import {createRouter, createWebHistory} from 'vue-router'
import {resolveRouters} from '@compose/api-model'

const a = resolveRouters()
const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...a]
})

export {Router}
export default Router
