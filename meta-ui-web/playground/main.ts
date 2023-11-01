import {createApp} from 'vue'

import App from './App.vue'
import Router from './router'

async function setupApp() {
  const createdApp = createApp(App)
  createdApp.use(Router)
  createdApp.mount('#ROOT')
}

setupApp().then(r => r)
