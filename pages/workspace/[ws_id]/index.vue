<template>
  <el-row>
    <el-col :span="4">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <p class="title">Projects</p>
          <el-icon><Plus /></el-icon>
        </div>
        <div>
          <el-space style="width: 100%">
            <el-select v-model="curAppId" class="m-2" placeholder="Select" size="large">
              <el-option
                  v-for="appData in appDatastore"
                  :key="appData.application_id"
                  :label="appData.name"
                  :value="appData.application_id"
                  placeholder="select a project"
                  @change="this.curDatastoreId = ''"
              />
            </el-select>
            <el-icon><MoreFilled /></el-icon>
          </el-space>
        </div>
      </div>
      <div>
      <el-collapse model-value="1">
        <el-collapse-item name="1">
          <template #title style="display: flex; justify-content: space-between">
            <p class="title">Datastore</p>
          </template>
          <el-space direction="vertical" :size="4" v-if="curAppId">
            <el-select v-model="curDatastoreId" class="m-2" placeholder="Select" size="large" @change="onSelectDatastore">
              <el-option
                  v-for="ds in appDatastore[getCurAppIndex].datastores"
                  :key="ds.datastore_id"
                  :label="ds.name"
                  :value="ds.datastore_id"
                  placeholder="select a project"
              />
            </el-select>
          </el-space>
        </el-collapse-item>
        </el-collapse>
    </div>
    </el-col>
    <el-col :span="20">
      <div>
          <el-table :data="dsItems.items">
            <el-table-column prop="string" label="Tarum" width="180" />
          </el-table>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {appService, itemService} from "~/services";
import {ApplicationAndDataStore} from "@hexabase/hexabase-js/dist/lib/types/application";
import {useRoute} from "#imports";
import {ElIcon, ElSpace, ElOption, ElSelect, ElRow, ElCol, ElCollapse, ElCollapseItem, ElTable} from "element-plus";
import {MoreFilled, Plus} from '@element-plus/icons-vue'
import {GetItemsPl} from "@hexabase/hexabase-js/src/lib/types/item/input";
import {DsItems} from "@hexabase/hexabase-js/dist/lib/types/item";

export default defineComponent({
  components: {
    MoreFilled,
    ElIcon, ElSpace, ElOption, ElSelect, ElRow, ElCol, ElCollapse, ElCollapseItem, Plus, ElTable
  },
  setup(){
  },
  data(){
    const {ws_id} = useRoute().params
    return {
      dsItems: {} as DsItems | undefined,
      getItemsParameters: {use_or_condition: false, sort_field_id: "", page: 1, per_page: 20} as GetItemsPl,
      activeNames: "1",
      ws_id,
      curAppId: "",
      curDatastoreId: "",
      appDatastore: [{}] as [ApplicationAndDataStore]
    }
  },
  methods: {
    async getAppAndDsData(id: string) {
      const appAndDs = await appService.getAppAndDs(id);
      if (appAndDs) {
        this.appDatastore = appAndDs;
      }
    },
    onSelectDatastore(){
      this.$router.push({path: this.$route.path, query: { datastore_id: this.curDatastoreId, application_id: this.curAppId }})
    this.getItems(this.curAppId, this.curDatastoreId)
    },
    async getItems(applicationId: string, datastoreId: string) {
      this.dsItems = await itemService.getItems(
          applicationId,
          datastoreId,
          this.getItemsParameters
      )
    },
  },
  computed: {
    getCurAppIndex() {
     const idx = this.appDatastore.findIndex(el => el.application_id === this.curAppId)
      return idx > 0 ? idx : 0
    }
  },
  mounted() {
    this.getAppAndDsData(this.ws_id as string)
  }

})
</script>

<style scoped>
.title{
  font-size: 14px;
}
</style>