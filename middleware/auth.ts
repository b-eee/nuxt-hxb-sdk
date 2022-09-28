import { useUserStore } from "~~/stores/user";
import {defineNuxtRouteMiddleware, navigateTo} from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (!userStore.userInfo.isAuthenticated && !JSON.parse(localStorage.getItem('user')!).token) {
    if (to.path !== '/' && to.path !== '/auth/login' ){
      return navigateTo('/');
    }
  }
  if (userStore.userInfo.isAuthenticated){
    if (to.path === '/' || to.path === '/auth/login'){
      return navigateTo('/workspace')
  }}
});
