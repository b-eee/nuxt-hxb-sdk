<template>
  <el-card class="box-card">
    <template #header>
      <div
        class="card-header"
        style="display: flex; justify-content: space-between"
      >
        <span class="tableTitle">Workspace</span>
        <el-button type="primary" @click="visibleCreateWs = true">Create Workspace</el-button>
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
<!--        <nuxt-link class="ml-3" :to="`/workspace/${curWsId}`">Go to workspace</nuxt-link>-->
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
                    :to="`/workspace/${this.curWsId}/project/${scope.row.application_id}/datastore/${ds.datastore_id}`"
                  >
                    {{ ds.name }}
                  </nuxt-link>
                </el-col>
                <el-col :span="19"> : {{ ds.datastore_id }} </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 1rem">
          <el-button type="primary" @click="openCreateAppModal" ref="createAppBtn">Create App</el-button>
        </div>
      </div>
    </div>
    <el-dialog
        v-model="visibleCreateWs"
        title="Create new workspace"
        width="30%"
    >
      <el-input placeholder="please enter workspace name" v-model="newWsName" />
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModalCreateWs">Cancel</el-button>
        <el-button type="primary" @click="() => createWorkspace(newWsName)"
        >Add</el-button
        >
      </span>
      </template>
    </el-dialog>
<!--    /////////////////////////-->
    <el-dialog
        v-model="visibleCreateApp"
        title="Create new application"
        width="75%"
    >
      <div>
        <div style="display: flex" >
          <p style="width: 100px; margin-right: 1rem">Project name</p>
          <el-input label="Project name" style="flex-grow: 1; width: 100%" v-model="createAppName" placeholder="please enter the application name"/>
        </div>
        <el-radio-group v-model="curTemplateId" style="width: 100%; display: block" @change="handleChangeTemplate">
          <el-tooltip
              class="box-item"
              effect="dark"
              content="Create application without template"
          >
          <el-radio border style="margin-top: 1rem; margin-bottom: 1rem" label="Blank" />
          </el-tooltip>
        <el-tabs class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane v-for="category in templates.categories" :key="category.category" :label="category.category">
            <div v-for="tp in category.templates">
              <div style="margin-top: 0.75rem">
                  <el-radio :label="tp.tp_id" style="width: 100%" border>
                    <span style="width: 500px; padding: 0.5rem; width: 100%">
                      {{ tp.name }}
                    </span>
                    <span style="padding: 0.5rem; width: 100%">
                      {{ tp.description }}
                    </span>
                  </el-radio>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        </el-radio-group>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModalCreateApp">Cancel</el-button>
        <el-button type="primary" @click="() => createApp()"
        >Add</el-button
        >
      </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { appService, workspaceService } from "~/services";
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
  ElInput,
  ElNotification,
  ElRadioGroup,
  ElRadio,
  ElTabs,
  ElTabPane,
  ElSpace,
    ElTooltip
} from "element-plus";
import {defineComponent, ref} from "vue";
import {definePageMeta} from "#imports";
import auth from "../../middleware/auth";
import {ApplicationAndDataStore, Templates} from "@hexabase/hexabase-js/dist/lib/types/application";
import {Workspaces} from "@hexabase/hexabase-js/dist/lib/types/workspace";
import {CreateProjectPl} from "@hexabase/hexabase-js/src/lib/types/application";
import type { TabsPaneContext } from 'element-plus'
import {FieldNameENJP} from "@hexabase/hexabase-js/src/lib/util/type";

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
    ElInput,
    ElRadioGroup,
    ElRadio,
    ElTabs,
    ElTabPane,
    ElSpace,
    ElTooltip
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
    const handleClick = (tab: TabsPaneContext, event: Event) => {
      console.log(tab, event)
    }
    return {
      handleClick,
      successNotif,
    };
  },
  data() {
    return {
      workspaces: {} as Workspaces | undefined,
      curWsId: "",
      appDatastore: [{}] as [ApplicationAndDataStore],
      isLoading: false,
      newWsName: "",
      visibleCreateWs: false,
      visibleCreateApp: false,
      templates: {} as Templates | undefined,
      curTemplateId: 'Blank',
      createAppName: '',
    };
  },
  methods: {
    handleChangeTemplate(){
    },
    async openCreateAppModal(){
      const btnLoading = ElLoading.service({
        target: 'createAppBtn'
      })
      this.templates = await appService.getTemplates()
      this.visibleCreateApp = true;
      btnLoading.close()
    },
    handleCloseModalCreateApp(){
      this.visibleCreateApp = false
      this.createAppName = ''
    },
    handleCloseModalCreateWs() {
      this.visibleCreateWs = false
      this.newWsName = ""
    },
    async getAppAndDsData(id: string) {
      const appAndDs = await appService.getAppAndDs(id);
      if (appAndDs) {
        this.appDatastore = appAndDs;
      }
    },
    async getWorkspaces() {
      this.workspaces = await workspaceService.getWorkspaces();
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
      this.visibleCreateWs = false
      this.newWsName = ""
      this.successNotif()
      tableLoading.close()
    },
    async createApp() {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      const createAppPl = {
        tp_id: this.curTemplateId === 'Blank' ? '' : this.curTemplateId,
        name: {
          en: this.createAppName,
          ja: this.createAppName
        }
      } as CreateProjectPl
      const app_id = await appService.createApp(createAppPl);

      this.visibleCreateWs = false
      this.successNotif('new project created successfully')
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

.el-radio{
  height: fit-content;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

</style>
