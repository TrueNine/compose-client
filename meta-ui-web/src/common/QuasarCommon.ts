//import '@quasar/extras/material-icons/material-icons.css'
//import '@quasar/extras/themify/themify.css'
//import 'quasar/dist/quasar.prod.css'

import type { App } from "vue";
import { Quasar } from "quasar";
import qZhCn from "quasar/lang/zh-CN";
import qEnUs from "quasar/lang/en-US";

export { qZhCn as QuasarZhCn, qEnUs as QuasarEnUs };

export function quasarInstall(app: App) {
    app.use(Quasar, {});
}
