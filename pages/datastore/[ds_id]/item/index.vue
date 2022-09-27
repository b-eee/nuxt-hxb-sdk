<template>
  <el-card class="box-card">
    <template #header>
      <div
          class="card-header"
          style="display: flex; justify-content: space-between"
      >
        <span class="tableTitle">Item</span>
        <el-button type="primary" :disable="true">Create Item</el-button>
      </div>
    </template>
    <div class="item current-id-ws">
      <el-table
          :data="dsItems.items"
          style="width: 100%"
      >
<!--        <el-table-column :prop="appDatastore[0].application_id" label=""></el-table-column>-->
<!--        <el-table-column :prop="ds_id" label=""></el-table-column>-->
        <el-table-column prop="created_at" label="Created at"></el-table-column>
        <el-table-column prop="created_by" label="Created by"></el-table-column>
        <el-table-column prop="d_id" label="Ds id"></el-table-column>
        <el-table-column prop="i_id" label="Item id"></el-table-column>
        <el-table-column prop="p_id" label="App id"></el-table-column>
        <el-table-column prop="rev_no" label="Review no" width="100"></el-table-column>
        <el-table-column prop="status_id" label="Status id"></el-table-column>
        <el-table-column prop="title" label="Title" width="120"></el-table-column>
        <el-table-column prop="unread" label="Unread" width="100"></el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script lang="ts">
import {
  ElSelect,
  ElOption,
  ElCard,
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElSpace,
  ElButton,
  ElLoading,
  ElDialog,
  ElInput
} from "element-plus";
import {useRoute, useRuntimeConfig} from "nuxt/app";
import {defineComponent, ref} from "vue";
import {appService, itemService, workspaceService} from "../../../../services";
import {DsItemType, GetItemsPlType} from "./type";

export default defineComponent({
  components: {
    ElSelect,
    ElOption,
    ElCard,
    ElTable,
    ElTableColumn,
    ElRow,
    ElCol,
    ElSpace,
    ElButton,
    ElLoading,
    ElDialog,
    ElInput
  },
  name: "Workspace",
  layout: "default",
  setup() {
    const urParse = window.location.origin.toString()
    return {
      urParse,
    };
  },
  data() {
    const route = useRoute()
    const {ds_id} = route.params
    const config = useRuntimeConfig();
    const url = config.public.baseUrl;
    const loadingData = ref(true);
    let getItemsParameters: GetItemsPlType = {
      use_or_condition: false,
      sort_field_id: "",
      page: 1,
      per_page: 20,
    }
    return {
      getItemsParameters,
      ds_id,
      workspaces: {
        current_workspace_id: "",
        workspaces: [
          {
            workspace_name: "",
            workspace_id: "",
          },
        ],
      },
      curWsId: "",
      appDatastore: [
        {
          application_id: "",
          datastores: null,
          display_id: "",
          name: "",
        },
      ],
      url,
      dsItems: {
        items: [],
        totalItems: 0
      }
    };
  },
  methods: {
    async getItems(url: string, applicationId: string, datastoreId: string) {
      const data = await itemService.getItems(
          url,
          applicationId,
          datastoreId,
          this.getItemsParameters
      )
      this.dsItems = data
    },
    async getAppAndDsData(url: string, id: string) {
      const appAndDs = await appService.getAppAndDs(url, id);
      if (appAndDs) {
        this.appDatastore = appAndDs;
        await  this.getItems(this.url, this.appDatastore[0].application_id, this.ds_id as string)
      }
    },
    async getWorkspaces(url: string) {
      const workspaces = await workspaceService.getWorkspaces(url);
      this.workspaces = workspaces
      this.curWsId = this.workspaces.current_workspace_id;
      await this.getAppAndDsData(this.url, this.curWsId);

    }
  },
  mounted() {
    ElLoading.service()
    this.getWorkspaces(this.url);
    ElLoading.service().close()
  },
});
</script>

<style scoped>
.tableTitle {
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 2rem;
}
</style>
