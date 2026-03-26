import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import routes from 'vue-router/auto-routes'
import App from './App.vue'
import './style.css'

const router = createRouter({
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
