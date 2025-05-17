import type { App, Plugin } from 'vue'
import YdDeviceFace from './components/device-face/index'

export * from './components/device-face/index'

const components = {
  YdDeviceFace,
} as Record<string, unknown>

export {
  components,
  YdDeviceFace,
}

export default {
  install: (app: App) => {
    Object.entries(components).forEach(([_name, component]) => {
      app.use(component as Plugin<[]>)
    })
  },
}
