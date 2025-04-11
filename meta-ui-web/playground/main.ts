import { createVuetifyMount, quasarInstall } from '@/common'

import { naiveStyleAdaptor } from '@/index'
import { createApp } from 'vue'

import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import 'uno.css'

const a = createVuetifyMount((r) => Object.assign({}, r))

function setupApp(): void {
  naiveStyleAdaptor()
  const createdApp = createApp(App)
  quasarInstall(createdApp)
  createdApp.use(a)
  createdApp.mount('#ROOT')
}

setupApp()
