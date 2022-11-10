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
          ref="table"
          :data="dsItems.items"
          style="width: 100%"
      >
        <!--        <el-table-column :prop="appDatastore[0].application_id" label=""></el-table-column>-->
        <!--        <el-table-column :prop="ds_id" label=""></el-table-column>-->
        <el-table-column prop="index" label="No" type="index" width="50"></el-table-column>
        <el-table-column prop="created_at" label="Created at" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="created_by" label="Created by"></el-table-column>
        <el-table-column prop="d_id" label="Ds id"></el-table-column>
        <el-table-column prop="i_id" label="Item id"></el-table-column>
        <el-table-column prop="p_id" label="App id"></el-table-column>
        <el-table-column prop="rev_no" label="Review no" width="100"></el-table-column>
        <el-table-column prop="status_id" label="Status id"></el-table-column>
        <el-table-column prop="title" label="Title" width="fit-content"></el-table-column>
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
import moment from "moment";
import {useRoute, useRuntimeConfig} from "#imports";
import {defineComponent, ref} from "vue";
import {appService, itemService, workspaceService} from "../../../../services";
import {DsItemType, GetItemsPlType} from "./type";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import {tryCatch} from "standard-as-callback/built/utils";
import {DsItems} from "@hexabase/hexabase-js/dist/lib/types/item";
import {ApplicationAndDataStore} from "@hexabase/hexabase-js/dist/lib/types/application";
import {Workspaces} from "@hexabase/hexabase-js/dist/lib/types/workspace";

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
    const dateFormat = (row: any, column: TableColumnCtx<any>) => {
      return moment(row.created_at).format('YYYY-MM-DD hh:mm:ss')
    }
    const urParse = window.location.origin.toString()
    return {
      urParse,
      dateFormat
    };
  },
  data() {
    const route = useRoute()
    const {ds_id} = route.params
    const config = useRuntimeConfig();
    const url = config.public.baseUrl;
    let getItemsParameters: GetItemsPlType = {
      use_or_condition: false,
      sort_field_id: "",
      page: 1,
      per_page: 20,
    }
    return {
      getItemsParameters,
      ds_id,
      workspaces: {} as Workspaces | undefined,
      curWsId: "",
      appDatastore: [{}] as [ApplicationAndDataStore],
      url,
      dsItems: {} as  DsItems | undefined
    };
  },
  methods: {
    async getItems(applicationId: string, datastoreId: string) {
      const data = await itemService.getItems(
          applicationId,
          datastoreId,
          this.getItemsParameters
      )
      this.dsItems = data
    },
    async getAppAndDsData(id: string) {
      const appAndDs = await appService.getAppAndDs(id);
      if (appAndDs) {
        this.appDatastore = appAndDs;
        if(this.appDatastore[0].application_id){
          await  this.getItems(this.appDatastore[0].application_id, this.ds_id as string)
        }
      }
    },
    async getWorkspaces() {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      const workspaces = await workspaceService.getWorkspaces();
      this.workspaces = workspaces
      if (this.workspaces && this.workspaces.current_workspace_id){
        this.curWsId = this.workspaces.current_workspace_id;
      }
      await this.getAppAndDsData(this.curWsId);
      tableLoading.close()
    }
  },
  mounted() {
    this.getWorkspaces();
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
