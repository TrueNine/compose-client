import type { VueElement } from 'vue'

import { createApp } from 'vue'
import { createVuetifyMount } from '../src/common'
import App from './App.vue'
import { Router } from './router'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import 'uno.css'

const a = createVuetifyMount((r) => Object.assign({}, r))

function setupApp(): void {
  const createdApp = createApp(App as unknown as VueElement)
  createdApp.use(a)
  createdApp.use(Router)
  createdApp.mount('#ROOT')
}

setupApp()
