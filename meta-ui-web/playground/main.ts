import { createApp } from "vue";

import App from "./App.vue";
import Router from "./router";

import { createVuetifyMount, quasarInstall } from "@/common";
import { naiveStyleAdaptor } from "@/index";

import "uno.css";

export const a = createVuetifyMount((r) => Object.assign({}, r));
async function setupApp() {
    naiveStyleAdaptor();
    const createdApp = createApp(App);
    quasarInstall(createdApp);
    createdApp.use(a);
    createdApp.use(Router);
    createdApp.mount("#ROOT");
}
setupApp().then((r) => r);
