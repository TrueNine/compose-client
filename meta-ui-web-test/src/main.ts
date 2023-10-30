import {createApp} from 'vue'

import App from './App.vue'
import Router from './router'
import 'virtual:uno.css'

async function setupApp() {
  const createdApp = createApp(App)
  createdApp.use(Router)
  createdApp.mount('#ROOT')
}

setupApp().then(r => r)
