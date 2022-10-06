  <template>
    <div class="common-layout">
      <el-container direction="vertical">
          <general-header />
        <el-container>
          <el-aside>
            <main-menu />
          </el-aside>
          <el-container>
            <el-main style="width: 100%; max-width: 100%">
              <slot />
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </template>

<script>
import GeneralHeader from "../components/GeneralHeader";
import {
  ElHeader,
  ElAside,
  ElContainer,
  ElMain,
  ElFooter
} from 'element-plus'
import {useRouter} from "nuxt/app";
import {useUser} from "../store/user";
export default {
  components: {
    ElHeader,
    ElAside,
    ElContainer,
    ElMain,
    ElFooter,
    GeneralHeader
  },
  setup(){
    const router = useRouter()

    router.beforeEach((to, from) => {
      const {isAuthenticated} = useUser().userInfo
      if (to.path !== '/auth/login' && !isAuthenticated) {
        return '/auth/login'
      }
    })
  }
};
</script>

<style>
body {
  font-family: "Source Sans Pro", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}
main {
  max-width: 650px;
  margin: 32px auto;
  padding: 0 24px;
}
a {
  color: deepskyblue;
  text-decoration: none;
}
article {
  margin: 0 auto;
  max-width: 650px;
}

.el-aside:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  height: 100%;
}

.el-aside.el-menu--collapse {
  width: fit-content;
  min-height: 400px;
  height: 100%;
}

</style>
