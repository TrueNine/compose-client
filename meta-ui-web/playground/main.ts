import type { VueElement } from 'vue'

import { createVuetifyMount, quasarInstall } from '../src/common'
import { naiveStyleAdaptor } from '../src/index'
import { createApp } from 'vue'

import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import 'uno.css'

const a = createVuetifyMount((r) => Object.assign({}, r))

function setupApp(): void {
  naiveStyleAdaptor()
  const createdApp = createApp(App as unknown as VueElement)
  quasarInstall(createdApp)
  createdApp.use(a)
  createdApp.mount('#ROOT')
}

setupApp()
