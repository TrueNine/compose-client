import { createRouter, createWebHistory } from "vue-router";
import { resolveRouters } from "@compose/api-model";

const a = resolveRouters();
console.log(a);
const Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...a],
});
console.log(Router.getRoutes());

export { Router };
export default Router;
