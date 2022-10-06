<template>
  <div>
  <p style="font-size: 30px; font-weight: bold; color: mediumseagreen">
    Welcome to Hexabase,
    <br />
    please login to continute</p>

    <nuxt-link  to="/auth/login">
      <el-button style="padding: 20px 30px;background-color: mediumseagreen; color: #fff" >
      Log In
      </el-button>
    </nuxt-link>


  </div>
</template>


<script lang="ts">

import {defineComponent} from "vue";
import auth from "~/middleware/auth";
import {definePageMeta} from "#imports"
import {ElButton} from "element-plus";


definePageMeta({
  middleware: auth,
  layout: "custom",
});

export default defineComponent({
  components: {
    ElButton
  }
});
</script>

<style>

</style>
