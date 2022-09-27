<template>
<!--  <el-card class="box-card">-->
<!--    <template #header>-->
<!--      <div-->
<!--          class="card-header"-->
<!--          style="display: flex; justify-content: space-between"-->
<!--      >-->
<!--        <span class="tableTitle">Item</span>-->
<!--        <el-button type="primary" :disable="true">Create Item</el-button>-->
<!--      </div>-->
<!--    </template>-->
<!--    <div class="item current-id-ws">-->
<!--      <el-table-->
<!--          :data="appDatastore"-->
<!--          style="width: 100%"-->
<!--      >-->
<!--        <el-table-column-->
<!--            prop="application_id"-->
<!--            label="Application id"-->
<!--            width="250"-->
<!--        />-->
<!--        <el-table-column prop="display_id" label="Display id" width="250" />-->
<!--        <el-table-column prop="name" label="Name" />-->
<!--        <el-table-column prop="datastores" label="Datastores">-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--    </div>-->
<!--  </el-card>-->
  <p>Item detail - coming </p>
</template>

<script>
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
import { ref } from "vue";
import {appService, itemService, workspaceService} from "../../../../services";
export default {
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
    const {ds_id, i_id} = route.params
    const config = useRuntimeConfig();
    const url = config.public.baseUrl;
    const loadingData = ref(true);
    return {
      ds_id,
      i_id,
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
      isLoading: false,
      dsItems: []
    };
  },
  methods: {
    async getItems() {
      const getItemsParameters = {}
      const data = await itemService.getItems(
          this.url,
          this.appDatastore.application_id,
          this.ds_id,
          getItemsParameters
      )

      this.dsItems = data
    },
    async getAppAndDsData(url, id) {
      const appAndDs = await appService.getAppAndDs(url, id);
      if (appAndDs) {
        this.appDatastore = appAndDs;

      }
    },
    async getWorkspaces(url) {
      const workspaces = await workspaceService.getWorkspaces(url);
      this.workspaces = workspaces
      this.curWsId = this.workspaces.current_workspace_id;
      await this.getAppAndDsData(this.url, this.curWsId);

    }
  },
  mounted() {
    ElLoading.service()
    this.getWorkspaces(this.url);
    this.getItems(
        this.url,
        this.appDatastore.application_id,
        this.appDatastore.datastores.datastore_id,
    )
    ElLoading.service().close()
  },
};
</script>

<style scoped>
.tableTitle {
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 2rem;
}
</style>
