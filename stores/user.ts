import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {
        email: "",
        name: "",
        token: "",
        userId: "",
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
    changeAuthTemp() {
      // for testing only
      this.user.isAuthenticated = true;
    },
  },
  getters: {
    // Get the full name whenever we need it
    userInfo(): any {
      return {
        email: this.user.email,
        name: this.user.name,
        userId: this.user.userId,
      };
    },
  },
});
