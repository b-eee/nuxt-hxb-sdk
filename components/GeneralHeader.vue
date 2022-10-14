<template>
  <div class="header-wrapper">
    <div style="
    height: 30px;
    width: 162px;
    background-image: url('https://hxb-wp-prod.s3.ap-northeast-1.amazonaws.com/wp-content/uploads/2022/03/18170050/logo2022-bk.svg');
    background-size: contain;
    ">
    </div>
    <el-button-group>
      <el-space :size="6">
        <el-avatar
            class="mr-3"
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <el-tag>Ola {{user.username}}</el-tag>
<!--        <div v-if="isAuthenticated">-->
<!--          <el-button @click="handleLogout">-->
<!--            <el-icon><Eleme /></el-icon>-->
<!--          </el-button>-->
        <el-button @click="handleLogout">
          Log out
        </el-button> <el-button style="background-color: mediumseagreen">
          <nuxt-link to="/auth/login" style="background-color: mediumseagreen; color: #fff">Log in</nuxt-link>
        </el-button>
<!--        </div>-->
      </el-space>
    </el-button-group>
  </div>
</template>

<script>
import { ElButton, ElButtonGroup, ElIcon, ElImage, ElSpace, ElAvatar, ElTag } from "element-plus";
import {Eleme} from '@element-plus/icons-vue'
import {userService} from "../services";
import {useUser} from "../store/user";
import {useRouter} from "nuxt/app";

export default {
  name: "GeneralHeader",
  components: {
    ElButton,
    ElButtonGroup,
    ElIcon,
    ElImage,
    ElSpace,
    ElAvatar,
    ElTag,
    Eleme
  },
  data(){
    const {isAuthenticated} = useUser().userInfo
    const user = JSON.parse(localStorage.getItem("user"))
    return {
      isAuthenticated,
      user
    }
  },
  methods: {
    async handleLogout(){
      await userService.logout()
      await useRouter().push('/auth/login')
    },
  }
};
</script>

<style scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  /* border: 1px solid #222222; */
  background-color: #e7e7e7;
  padding: 1rem;
}
</style>
