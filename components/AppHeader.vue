<template>
  <header>
    <a
      class="flex justify-center pt-8 sm:pt-0"
      href="https://apidoc.hexabase.com/"
      target="_blank"
    >
      <img class="img-logo" alt="hexabase logo" src="~/static/hexabase.png" />
    </a>
    <h1>Hexabase Nuxtjs Graphql</h1>
    <nav>
      <router-link exact :to="path" class="link">Index</router-link>
      <router-link exact to="/workspace" class="link">Workspaces</router-link>
      <router-link exact to="/application" class="link"
        >Applications</router-link
      >
      <router-link exact to="/datastore" class="link">Datastores</router-link>
      <router-link exact to="/item" class="link">Items</router-link>
    </nav>
  </header>
</template>

<script lang="ts">
export default {
  name: "AppHeader",
  data() {
    const isAuthenticated = JSON.parse(localStorage.getItem("auth")!) === true;
    return {
      path: isAuthenticated ? "/" : "/auth/login",
    };
  },
};
</script>

<style scoped>
header {
  padding: 24px 32px;
  margin-bottom: 32px;
  text-align: center;
}
h1 {
  font-weight: 100;
}
nav {
  max-width: 650px;
  margin: 0 auto;
}
.link {
  font-size: 18px;
  margin-right: 16px;
}
.nuxt-link-active {
  font-weight: bold;
  text-decoration: underline;
}
.img-logo {
  max-width: 200px;
}
</style>