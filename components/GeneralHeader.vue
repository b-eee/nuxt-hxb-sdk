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
        <el-button style="background-color: mediumseagreen; color: #fff">Profile</el-button>
        <el-button style="background-color: mediumseagreen; color: #fff">Start your project</el-button>
<!--        <div v-if="isAuthenticated">-->
          <el-button @click="handleLogout">Log out</el-button>
<!--        </div>-->
      </el-space>
    </el-button-group>
  </div>
</template>

<script>
import { ElButton, ElButtonGroup, ElIcon, ElImage, ElSpace } from "element-plus";
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
    ElSpace
  },
  data(){
    const {isAuthenticated} = useUser().userInfo
    console.log(useUser().userInfo)
    return {
      isAuthenticated
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
