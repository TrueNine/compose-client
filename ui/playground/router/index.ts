/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

import { createRouter, createWebHistory } from 'vue-router'
import { routes as autoRoutes, handleHotUpdate } from 'vue-router/auto-routes'

const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: autoRoutes,
})

if (import.meta.hot) {
  handleHotUpdate(Router)
}

export {
  Router,
}
