import {createRouter, createWebHistory} from 'vue-router'

const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/form',
    component: () => import('../pages/form/FormPage.vue')
  }]
})

export {Router}
export default Router
