import {createApp} from 'vue'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import App from './App.vue'
import Router from './router'

import {createVuetifyMount, quasarInstall} from '@/common'
import {naiveStyleAdaptor} from '@/index'

import 'uno.css'
import {Pinia} from './store'

export const a = createVuetifyMount(r => Object.assign({}, r))
async function setupApp() {
  naiveStyleAdaptor()
  const createdApp = createApp(App)
  quasarInstall(createdApp)
  createdApp.use(Pinia)
  createdApp.use(a)
  createdApp.use(Router)
  createdApp.mount('#ROOT')
}
setupApp().then(r => r)
