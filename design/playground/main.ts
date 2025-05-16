import type { VueElement } from 'vue'

import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import { Router } from './router'

import 'vuetify/styles'
import 'uno.css'
import '@mdi/font/css/materialdesignicons.css'

function setupApp(): void {
  const createdApp = createApp(App as unknown as VueElement)
  const vuetify = createVuetify()
  createdApp.use(Router)
  createdApp.use(vuetify)
  createdApp.mount('#ROOT')
}

setupApp()
