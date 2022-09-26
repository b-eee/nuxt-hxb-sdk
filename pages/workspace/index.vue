<template>
  <el-card class="box-card">
    <template #header>
      <div
        class="card-header"
        style="display: flex; justify-content: space-between"
      >
        <span class="tableTitle">Application in workspace</span>
        <el-button type="primary" :disabled="true">Create Workspace</el-button>
      </div>
    </template>
    <div class="item current-id-ws">
      <div style="display: flex; align-items: center; margin-bottom: 20px">
        <span class="mr-3">Current Workspace</span>
        <el-select
          v-model="curWsId"
          @change="handleChange"
          placeholder="Select workspace"
          size="large"
          style="width: max-content"
        >
          <el-option
            v-for="ws in workspaces.workspaces"
            :key="ws.value"
            :label="ws.workspace_name"
            :value="ws.workspace_id"
          />
        </el-select>
      </div>
      <div>
        <el-table
            :data="appDatastore"
            style="width: 100%"
        >
          <el-table-column
            prop="application_id"
            label="Application id"
            width="250"
          />
          <el-table-column prop="display_id" label="Display id" width="250" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="datastores" label="Datastores">
            <template  #default="scope">
                <el-row
                v-for="ds in scope.row.datastores"
                :key="ds.id"
                class="my-4"
              >
                <el-col :span="5">
                  <nuxt-link
                    :to="`${urParse}/project/${scope.row.application_id}/datastore/${ds.datastore_id}`"
                  >
                    {{ ds.name }}
                  </nuxt-link>
                </el-col>
                <el-col :span="19"> : {{ ds.datastore_id }} </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</template>

<script>
import { appService, workspaceService } from "../../services";
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
} from "element-plus";
import { useRuntimeConfig } from "nuxt/app";
import { ref } from "vue";
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
  },
  name: "Workspace",
  layout: "default",
  setup() {
    const loading = ref(true)
    const urParse = window.location.origin.toString();
    const loadingScreenOptions = {
      fullscreen: false,
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    }

    return {
      loading,
      urParse,
      loadingScreenOptions,
    };
  },
  data() {
    const config = useRuntimeConfig();
    const url = config.public.baseUrl;
    const loadingData = ref(true);
    return {
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
      loadingData,
    };
  },
  methods: {
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
    },
    async setCurrentWs(url, wsId) {
      await workspaceService.setWorkspace(url, wsId);
    },
    async handleChange() {
      ElLoading.service()
      await this.setCurrentWs(this.url, this.curWsId);
      await this.getWorkspaces(this.url);
      ElLoading.service().close()
    },
  },
  mounted() {
    ElLoading.service()
    this.getWorkspaces(this.url);
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
