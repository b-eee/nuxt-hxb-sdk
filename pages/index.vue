<template>
  <div>
    <p style="font-size: 30px; font-weight: bold; color: mediumseagreen">
      Welcome to Hexabase
    </p>
  </div>
  <el-button type="link">
    <nuxt-link to="/workspace">To workspace</nuxt-link>
  </el-button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { definePageMeta } from "#imports";
import { ElButton } from "element-plus";

definePageMeta({
  layout: "custom",
});

export default defineComponent({
  components: {
    ElButton,
  },
});
</script>

<style></style>
