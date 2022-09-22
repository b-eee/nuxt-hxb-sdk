<script setup>
import Login from "./auth/login";

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <h1>Welcome to your dashboard</h1>
</template>
