<template>
  <p>Welcome to Hexabase, please login to continute</p>
  <nuxt-link to="/auth/login">Log In</nuxt-link>
</template>


<script lang="ts">

import {defineComponent} from "vue";
import auth from "~/middleware/auth";
import {definePageMeta} from "#imports"


definePageMeta({
  middleware: auth,
  layout: "custom",
});

export default defineComponent({
});
</script>

<style>

</style>
