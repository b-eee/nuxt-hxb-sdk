<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <div style="margin: 0.5rem">
    <el-button
      type="primary"
      :style="{ transform: `${isCollapse ? 'rotate(180deg)' : ''}`, transition: 'all ease-in 0.3s', width: '100%' }"
      @click="isCollapse = !isCollapse"
    >
      <el-icon><ArrowLeftBold /></el-icon>
    </el-button>
    </div>
    <el-divider />
    <el-menu-item index="1" @click="handleNavigate('application')">
      <el-icon><DataBoard /></el-icon>
      <template #title>Application</template>
    </el-menu-item>
    <el-menu-item index="2" @click="handleNavigate('workspace')">
      <el-icon><icon-menu /></el-icon>
      <template #title>Workspaces</template>
    </el-menu-item>
    <el-menu-item index="3" @click="handleNavigate('datastore')">
      <el-icon><coin /></el-icon>
      <template #title>DataStores</template>
    </el-menu-item>
    <el-menu-item index="4" @click="handleNavigate('/datastore/:ds_id/item')">
      <el-icon><document /></el-icon>
      <template #title>Items</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
};
const handleClose = (key: string, keyPath: string[]) => {
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
import "element-plus/es/components/message/style/css";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  ArrowRightBold,
  ArrowLeftBold,
  DataBoard,
  Coin,
} from "@element-plus/icons-vue";
import {
  ElIcon,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElMenuItemGroup,
  ElRadioGroup,
  ElRadioButton,
  ElDivider,
  ElButton,
} from "element-plus";
import {navigateTo} from "nuxt/app";
export default defineComponent({
  name: "MainMenu",
  components: {
    Document,
    IconMenu,
    Location,
    Setting,
    ElIcon,
    ElMenu,
    ElMenuItem,
    ElSubMenu,
    ElMenuItemGroup,
    ElRadioGroup,
    ElRadioButton,
    ArrowLeftBold,
    ArrowRightBold,
    ElDivider,
    ElButton,
    DataBoard,
    Coin,
  },
  data() {
    return {
      isMenuOpen: true,
    };
  },
  methods: {
    async handleNavigate (routePath: string) {
      await navigateTo(`/${routePath}`)
    }
  }
});
</script>

<style>
 .el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
.el-menu-vertical-demo.el-menu--collapse {
  width: fit-content;
  min-height: 400px;
}
</style>
