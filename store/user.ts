import { defineStore } from "pinia";

export const useUser = defineStore("user", {
  state: () => {
    return {
      user: {
        token: "",
        isAuthenticated: false,
      },
    };
  },
  actions: {
    updateAuth(token: any) {
      if (token) {
        this.user.isAuthenticated = true;
        this.user.token = token;
      }
    },
    removeAuth(){
      this.user = {
        token: "",
        isAuthenticated: false,
        }
      }
  },
  getters: {
    // Get the full name whenever we need it
    userInfo(): any {
      return {
        isAuthenticated: this.user.isAuthenticated
      };
    },
  },
});
