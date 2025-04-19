import type { App } from 'vue'
import { Quasar } from 'quasar'
import qEnUs from 'quasar/lang/en-US'
import qZhCn from 'quasar/lang/zh-CN'

export { qEnUs as QuasarEnUs, qZhCn as QuasarZhCn }

export function quasarInstall(app: App): void {
  app.use(Quasar, {})
}
