<template>
  <div class="custom-layout">
    <el-container direction="vertical">
      <general-header />
        <el-container>
          <el-main style="width: 100%; max-width: 100%; height: calc(100vh - 64px); background-image: url('https://www.hexabase.com/wp-content/uploads/2022/03/bg-2022main3.png')">
            <slot />
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script>
import GeneralHeader from "../components/GeneralHeader";
import {
  ElAside,
  ElContainer,
  ElMain,
} from 'element-plus'
export default {
  components: {
    ElAside,
    ElContainer,
    ElMain,
    GeneralHeader
  },
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
