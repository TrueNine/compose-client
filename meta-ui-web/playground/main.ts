import {createApp} from 'vue'

import {naiveStyleAdaptor} from '../index'

import App from './App.vue'
import Router from './router'
import 'uno.css'

async function setupApp() {
  naiveStyleAdaptor()
  const createdApp = createApp(App)
  createdApp.use(Router)
  createdApp.mount('#ROOT')
}

setupApp().then(r => r)
