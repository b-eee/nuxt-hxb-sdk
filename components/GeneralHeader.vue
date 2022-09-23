<template>
  <div class="header-wrapper">
    <div>HEXABASE v.1.1.1 </div>
    <el-button-group>
      <el-space :size="6">
        <el-button type="primary">Profile</el-button>
        <el-button type="success">Start your project</el-button>
      </el-space>
    </el-button-group>
  </div>
</template>

<script>
import {
  ElButton,
  ElButtonGroup,
  ElIcon
} from 'element-plus'
export default {
  name: "GeneralHeader",
  components: {
    ElButton,
    ElButtonGroup,
    ElIcon
  }
}
</script>

<style scoped>
  .header-wrapper{
    display: flex;
    justify-content: space-between;
    border: 1px solid #222222;
    padding: 1rem;
  }
</style>