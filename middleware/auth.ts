import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import {useUser} from "~/store/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUser();
  // // if (!userStore.userInfo.isAuthenticated) {
  // //   if (to.path !== "/" && to.path !== "/auth/login") {
  // //     return navigateTo("/");
  // //   }
  // // }
  // if (userStore.userInfo.isAuthenticated) {
  //   if (to.path === "/" || to.path === "/auth/login") {
  //     return navigateTo("/workspace");
  //   }
  // }
});
