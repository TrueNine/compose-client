import {createApp} from 'vue'

import {createVuetifyMount} from '../common'
import {naiveStyleAdaptor} from '../index'

import App from './App.vue'
import Router from './router'

import 'uno.css'

export const a = createVuetifyMount(r => Object.assign({}, r))
async function setupApp() {
  naiveStyleAdaptor()
  const createdApp = createApp(App)
  createdApp.use(Router)
  createdApp.use(a)
  createdApp.mount('#ROOT')
}
setupApp().then(r => r)
