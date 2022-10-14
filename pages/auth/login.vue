<template>
  <div class="login-wrapper">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      label-position="top"
      title="Hexabase"
      class="login-form"
      size="large"
      scroll-to-error
    >
      <el-space
        wrap
        :size="6"
        direction="vertical"
        style="
          font-size: 30px;
          font-weight: bold;
          width: 100%;
          text-align: center;
          margin-bottom: 20px;
        "
      >
<!--        <span> Hexabase </span>-->
      <div style="
        height: 38px;
        width: 200px;
        background-image: url('https://hxb-wp-prod.s3.ap-northeast-1.amazonaws.com/wp-content/uploads/2022/03/18170050/logo2022-bk.svg');
        background-size: contain;
        background-repeat: no-repeat;
        ">
      </div>
      </el-space>
      <el-form-item label="Email" prop="email">
        <el-input
          v-model="ruleForm.email"
          type="email"
          autocomplete="off"
          clear
        />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
          show-password
          clear
        />
      </el-form-item>
      <el-form-item>
        <el-button
          key="submit"
          htmlType="submit"
          style="width: 100%; background-color: mediumseagreen; color: #fff"
          @click.prevent="onSubmit(ruleForm)"
          >Login</el-button
        >
<!--        <el-button style="background-color: mediumseagreen; color: #fff"> Register </el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import type { FormInstance } from "element-plus";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSpace,
  ElLoading,
} from "element-plus";
import "element-plus/es/components/message/style/css";
import { userService } from "~/services/user.service";
import { alertService } from "~/services/alert.service";
import {createApp, defineComponent, reactive, ref} from "vue";
import {definePageMeta} from "#imports";
import {useRuntimeConfig, useState} from "nuxt/app";
import auth from "~/middleware/auth";
import {useUser} from "~/store/user";

interface LoginInputTypes {
  email: string;
  password: string;
}

definePageMeta({
  layout: false,
  middleware: auth,
});

export default defineComponent({
  async setup() {
    const ruleFormRef = ref<FormInstance>();

    const checkEmail = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("Please input the email"));
      }
    };

    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        callback();
      }
    };

    const ruleForm = reactive({
      email: "",
      password: "",
    });

    const rules = reactive({
      email: [{validator: checkEmail, trigger: "blur"}],
      password: [{validator: validatePass, trigger: "blur"}],
    });

    return {
      rules,
      ruleForm,
      ruleFormRef,
    };
  },
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElSpace,
    ElLoading,
  },
  data() {
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrl;
    return {
      isLoading: false,
      baseUrl,
    };
  },
  mounted() {
  },
  methods: {
    async onSubmit(ruleForm: LoginInputTypes) {
      const loginParams = {
        email: ruleForm.email,
        password: ruleForm.password,
      };

      try {
        ElLoading.service();
        console.log('go there')
        const token = await userService.login(
          loginParams.email,
          loginParams.password
        );
        token && useUser().updateAuth(token);
        console.log(token)
        this.$router.push("/workspace");
      } catch {
        alertService.error("Login fail, please try again", {});
      } finally {
        ElLoading.service().close();
      }
    },
  },
});
</script>

<style scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
