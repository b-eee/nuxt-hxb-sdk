<script setup lang="ts">
import { ID_INJECTION_KEY } from "element-plus";
import "element-plus/es/components/message/style/css";
import {provide} from "vue";
import {definePageMeta} from "#imports";
import auth from "~/middleware/auth";

definePageMeta({
  middleware: auth
});

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
