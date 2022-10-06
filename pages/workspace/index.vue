<template>
  <el-card class="box-card">
    <template #header>
      <div
        class="card-header"
        style="display: flex; justify-content: space-between"
      >
        <span class="tableTitle">Application in workspace</span>
        <el-button type="primary" @click="visible = true">Create Workspace</el-button>
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
            :key="ws.workspace_id"
            :label="ws.workspace_name"
            :value="ws.workspace_id"
          />
        </el-select>
      </div>
      <div>
        <el-table
            :data="appDatastore"
            style="width: 100%"
            ref="table"
        >
          <el-table-column
            prop="index"
            type="index"
            label="No"
            width="50"
          />
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
    <el-dialog
        v-model="visible"
        title="Create new workspace"
        width="30%"
    >
      <el-input placeholder="please enter workspace name" v-model="newWsName" />
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModal">Cancel</el-button>
        <el-button type="primary" @click="() => createWorkspace(newWsName)"
        >Add</el-button
        >
      </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { appService, workspaceService } from "../../services";
import {
  ElSelect,
  ElOption,
  ElCard,
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElButton,
  ElLoading,
  ElDialog,
  ElInput, ElNotification
} from "element-plus";
import { useRuntimeConfig } from "nuxt/app";
import {defineComponent, ref} from "vue";
import {definePageMeta} from "#imports";
import auth from "../../middleware/auth";
import {ApplicationAndDataStore} from "@hexabase/hexabase-js/dist/lib/types/application";
import {Workspaces} from "@hexabase/hexabase-js/dist/lib/types/workspace";
definePageMeta({
  middleware: auth
})
export default defineComponent({
  components: {
    ElSelect,
    ElOption,
    ElCard,
    ElTable,
    ElTableColumn,
    ElRow,
    ElCol,
    ElButton,
    ElLoading,
    ElDialog,
    ElInput
  },
  name: "Workspace",
  layout: "default",
  setup() {
    const successNotif = (message?: string) => {
      ElNotification({
        title: 'Success',
        message: message || 'Workspace created',
        type: 'success',
      })
    }
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
      successNotif
    };
  },
  data() {
    const config = useRuntimeConfig();
    const url = config.public.baseUrl;
    const loadingData = ref(true);
    return {
      workspaces: {} as Workspaces | undefined,
      curWsId: "",
      appDatastore: [{}] as [ApplicationAndDataStore],
      url,
      isLoading: false,
      loadingData,
      newWsName: "",
      visible: false
    };
  },
  methods: {
    handleCloseModal() {
      this.visible = false,
      this.newWsName = ""
    },
    async getAppAndDsData(id: string) {
      const appAndDs = await appService.getAppAndDs(id);
      if (appAndDs) {
        this.appDatastore = appAndDs;
      }
    },
    async getWorkspaces() {
      const workspaces = await workspaceService.getWorkspaces();
      this.workspaces = workspaces
      if (this.workspaces && this.workspaces.current_workspace_id)
      this.curWsId = this.workspaces.current_workspace_id;
      await this.getAppAndDsData(this.curWsId);

    },
    async setCurrentWs(wsId: string) {
      await workspaceService.setWorkspace(wsId);
    },
    async createWorkspace(name: string) {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      const w_id = await workspaceService.createWorkspace(name);
      await this.getWorkspaces()
      if (w_id){
        this.curWsId = w_id
      }
      this.visible = false,
      this.newWsName = ""
      this.successNotif()
      tableLoading.close()
    },

    async handleChange() {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      await this.setCurrentWs(this.curWsId);
      await this.getWorkspaces();
      tableLoading.close()
    },
  },
  mounted() {
    const tableLoading = ElLoading.service({
      target: 'table'
    })
    this.getWorkspaces();
    tableLoading.close()
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
