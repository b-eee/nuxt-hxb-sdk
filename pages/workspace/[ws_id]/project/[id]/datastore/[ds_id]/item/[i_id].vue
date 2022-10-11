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
        <el-table-column v-for="field in itemFields" :key="field.field_id" :prop="field.display_id" :label="field.name" width="180">
          <template #default="scope">
            <p v-if="scope.row.data_type === 'dateTime'">{{ moment(scope.row.field_id) }}</p>
            <p v-if="scope.row.data_type === 'test'">{{ scope.row.field_id }}</p>
          </template>
        </el-table-column>
      </el-table>
      {{ JSON.stringify(itemFields) }}
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
import {useRoute, useRuntimeConfig} from "nuxt/app";
import {defineComponent, ref} from "vue";
import {DsItemType, GetItemsPlType} from "./type";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import {tryCatch} from "standard-as-callback/built/utils";
import {appService, itemService, workspaceService} from "~/services";
import {Workspaces} from "@hexabase/hexabase-js/dist/lib/types/workspace";
import {ApplicationAndDataStore} from "@hexabase/hexabase-js/dist/lib/types/application";
import {DsItems} from "@hexabase/hexabase-js/dist/lib/types/item";
import {datastoreService} from "~/services/datastore.service";

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
    const {ws_id, id, ds_id} = route.params
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
      id,
      ws_id,
      url,
      dsItems: {} as  DsItems | undefined,
      itemFields: [] as any[]
    };
  },
  methods: {
    async getItems() {
      this.dsItems = await itemService.getItems(
          this.id as string,
          this.ds_id as string,
          this.getItemsParameters
      )
    },
    async getFields(){
      const fieldInfo = await datastoreService.getFields(this.ds_id as string, this.id as string)
      console.log(fieldInfo)
      const idArray = Object.keys(fieldInfo.fields)

      console.log(idArray)
      idArray.map(item =>
          this.itemFields.push({
            title: fieldInfo.fields[item].name,
            dataType: fieldInfo.fields[item].dataType,
            field_id: fieldInfo.fields[item].field_id,
            display_id: fieldInfo.fields[item].display_id,
          })
      )
      console.log(this.itemFields)

    },
  },
  mounted() {
    this.getItems()
    this.getFields()
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
