<template>
    <el-card class="box-card">
      <template #header>
        <div class="card-header" style="display: flex; justify-content: space-between">
          <span>Application in workspace</span>
          <el-button type="primary">Create Workspace</el-button>
        </div>
      </template>
      <div class="item current-id-ws">
          <div style="display: flex; align-items: center; margin-bottom: 20px">
            <span class="mr-3">Current Workspace</span>
            <el-select
              v-model="currentWorkspace"
              placeholder="Select workspace" size="large"
              style="width: max-content"
          >
            <el-option
                v-for="ws in workspaces.workspaces"
                :key="ws.value"
                :value="ws.workspace_name"
            />
          </el-select>
          </div>
          <div>
            <el-table v-model="appDatastore" style="width: 100%">
              <el-table-column prop="application_id" label="Application id" width="180" />
              <el-table-column prop="display_id" label="Display id" width="180" />
              <el-table-column prop="name" label="Name" />
              <el-table-column prop="datastores" label="Datastores">
                <template #default="scope">
                    <el-row v-for="ds in scope.row.datastores" class="my-4">
                      <el-col :span="5">
                      <nuxt-link :to="`${urParse}/pj/${scope.row.application_id}/ds/${ds.datastore_id}`">
                        {{ ds.name }}
                      </nuxt-link>
                      </el-col>
                      <el-col :span="19">
                        : {{ ds.datastore_id }}
                      </el-col>
                    </el-row>
                </template>
              </el-table-column>
            </el-table>
          </div>
      </div>
    </el-card>

</template>

<script>
import {appService, workspaceService} from "../../services";
import {
  ElSelect,
  ElOption,
  ElCard,
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElSpace,
  ElButton
} from 'element-plus'
import {useRuntimeConfig} from "nuxt/app";
import {ref} from "vue";
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
    ElButton
  },
  name: "Workspace",
  layout: "default",
  setup() {
    const urParse = window.location.origin.toString()
    return {
      urParse,
    }
  },
  data() {
    const config = useRuntimeConfig()
    const baseUrl = config.public?.baseUrl
    const loadingData = ref(true)
    return {
      workspaces: null,
      currentWorkspace: "",
      appDatastore: [],
      baseUrl,
      isLoading: false,
      loadingData
    }
  },
  methods: {
    async getAppAndDsData (baseUrl, id) {
      const appAndDs = await appService.getAppAndDs(baseUrl, id)
      if (appAndDs) {
        this.appDatastore = appAndDs
      }
    },
    async getWorkspaces (url) {
      this.isLoading = true
      const resWorkspaces = await workspaceService.getWorkspaces(url)
      this.isLoading = false
      this.workspaces = resWorkspaces
      this.currentWorkspace =  resWorkspaces.current_workspace_id
      console.log(this.currentWorkspace)
    },
    async resetWorkspace (wid) {
      this.workspaces = {...this.workspaces, current_workspace_id: wid}
    },
    async setCurrentWs (wsId) {
      const data = await workspaceService.setWorkspace(wsId)
      this.workspaces = data?.workspaces
    },
    async handleChange () {
      const data = await this.setCurrentWs(this.currentWorkspace)
      data.success && await this.resetWorkspace(this.currentWorkspace)
    }
  },
  mounted() {
    this.getWorkspaces(this.baseUrl)
  },
  watch: {
    currentWorkspace(){
      this.getAppAndDsData(this.baseUrl, this.currentWorkspace)
      this.getWorkspaces(this.baseUrl)
    },
  }
}
</script>

<style scoped>

</style>