<template>
  <el-card class="box-card">
    <template #header>
      <div
          class="card-header"
          style="display: flex; justify-content: space-between"
      >
        <span class="tableTitle">Item</span>
        <el-button type="primary" @click="visible = true">Create Item</el-button>
      </div>
    </template>
    <el-row :gutter="12">
      <el-col :span="18">
        <el-table
            ref="table"
            :data="dsItems.items"
            style="width: 100%"
            @row-click="(row, column, event) => handleCLick(row, column, event)"
            :highlight-current-row="true"
        >
          <el-table-column v-for="field in itemFields" :key="field.field_id" :prop="field.display_id" :label="field.display_id">
            <template #default="scope">
              <p v-if="field.data_type === 'dateTime'">{{ moment(scope.row[field.field_id]) }}</p>
              <p v-if="field.data_type === 'text'">{{ scope.row[field.field_id] }}</p>
              <p v-if="field.data_type === 'status'">{{ scope.row[field.field_id] }}</p>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="6">
        <el-descriptions
            title="Item detail"
            :column="1"
            direction="vertical"
            border
        >
          <div style="height: calc(100vh - 237px); overflow-y: scroll">
            <template v-for="itemDetail in Object.keys(currentItemDetail)">
              <el-descriptions-item  :label="getLabel(itemDetail)" v-if="!itemDetail.includes('_id')">
                {{ currentItemDetail[itemDetail] }}
              </el-descriptions-item>
            </template>
          </div>
        </el-descriptions>
      </el-col>
    </el-row>
  </el-card>
  <el-dialog
      v-model="visible"
      title="Create new item"
      width="60%"
      @close="handleCloseModal"
  >
    <el-form :model="createItemParams" class="demo-form-inline">
        <template v-for="(param, index) in createItemParams" :key="index">
          <div style="display: flex">
            <div style="flex-grow: 1; margin-right: 20px">
              <el-form-item :label="`param ${index + 1}`">
                <el-input v-model="createItemParams[index][`param${index}`]" placeholder="enter param content" />
              </el-form-item>
            </div>
            <el-form-item>
              <el-button @click="() => removeItemCreateParam(index)">
                <el-icon><Remove /></el-icon>
              </el-button>
            </el-form-item>
          </div>
        </template>
        <el-form-item>
          <el-button type="primary" @click="addParamRow">
            Add new param
          </el-button>
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModal">Cancel</el-button>
        <el-button type="primary" @click="() => createItem()"
        >Add</el-button
        >
      </span>
    </template>
  </el-dialog>
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
  ElInput,
  ElDescriptions,
  ElDescriptionsItem,
  ElNotification,
  ElIcon,
  ElForm,
  ElFormItem,
} from "element-plus";
import moment from "moment";
import {useRoute, useRuntimeConfig} from "nuxt/app";
import {defineComponent, ref} from "vue";
import {GetItemsPlType} from "./type";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import {itemService} from "~/services";
import {DsItems} from "@hexabase/hexabase-js/dist/lib/types/item";
import {datastoreService} from "~/services/datastore.service";
import {DsAction} from "@hexabase/hexabase-js/src/lib/types/datastore/response";
import {CirclePlus, Remove} from "@element-plus/icons-vue";
import {DeleteItemReq} from "@hexabase/hexabase-js/src/lib/types/item/input";

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
    ElInput,
    ElDescriptions,
    ElDescriptionsItem,
    ElIcon,
    CirclePlus,
    Remove,
    ElForm,
    ElFormItem,
  },
  name: "Workspace",
  layout: "default",
  setup() {
    const {i_id} = useRoute().params
    const dateFormat = (row: any, column: TableColumnCtx<any>) => {
      return moment(row.created_at).format('YYYY-MM-DD hh:mm:ss')
    }
    const urParse = window.location.origin.toString()
    const tableLoading = ElLoading.service({
      target: 'table'
    })
    const successNotif = (message?: string) => {
      ElNotification({
        title: 'Success',
        message: message || 'Item created',
        type: 'success',
      })
    }
    return {
      i_id,
      urParse,
      dateFormat,
      tableLoading,
      successNotif
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
      createItemParams: [{}] as any[],
      visible: false,
      getItemsParameters,
      ds_id,
      id,
      ws_id,
      url,
      dsItems: {} as  DsItems | undefined,
      itemFields: [] as any[],
      currentItemDetail: {}
    };
  },
  computed: {

  },
  methods: {
    removeItemCreateParam(index: number){
      console.log((Object.values(this.createItemParams[index]))[0])
      console.log(index)
      console.log(this.createItemParams)
      this.createItemParams.splice(index, 1)
      console.log(this.createItemParams)
    },
    addParamRow(){
      const curLen = this.createItemParams.length
      const newParamLabel = `param${curLen}`
      this.createItemParams.push({})
    },
    async createItem() {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      const dsActions: DsAction[] = await datastoreService.getActions(this.ds_id as string)
      const actionIdCreate = dsActions.find(action => action?.operation?.trim().toLowerCase() === 'new')?.action_id
        let result = {}
        // { 'param1': value }
        // [{}, {}]
        this.createItemParams.forEach((item, index) => {
          result = Object.assign(result, item)
        })
      const newItemPl = {
        action_id: actionIdCreate,
        use_display_id: true,
        return_item_result: true,
        ensure_transaction: false,
        exec_children_post_procs: true,
        access_key_updates: {
        overwrite: true,
        ignore_action_settings: true
        },
        item: result
      };

      console.log("actionIdCreate", actionIdCreate)

      const newItem = await itemService.createItem(this.id as string, this.ds_id as string, newItemPl);

      console.log("newItemmm", newItem)
      this.visible = false;
      if (newItem) {
        this.successNotif()
        await this.getItems()
      }
      tableLoading.close()
    },
    async deleteItem() {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      const dsActions: DsAction[] = await datastoreService.getActions(this.ds_id as string)
      const actionIdDelete = dsActions.find(action => action?.operation?.trim().toLowerCase() === 'delete')?.action_id
        let result = {}
        this.createItemParams.forEach((item, index) => {
          result = Object.assign(result, item)
        })
      if (actionIdDelete){
        const deleteItemReq: DeleteItemReq = {
          a_id: actionIdDelete,
          use_display_id: true,
          delete_linked_items: true,
        };
      await itemService.deleteItem(this.id as string, this.ds_id as string, this.i_id as string, deleteItemReq);
      }

      this.visible = false;
      this.successNotif('Item deleted successfully')
      await this.getItems()
      tableLoading.close()
    },
    handleCloseModal(){
      this.visible = false,
      this.createItemParams = [{
        param1: ''
      }]
    },
    getLabel(label: string){
      const idLabelArr = this.itemFields.map(i => i.field_id)
      if(idLabelArr.includes(label)){
        const altLabel = this.itemFields.find(i => i.field_id === label).display_id
        return altLabel.charAt(0).toUpperCase() + altLabel.slice(1);
      }
      else {
        let adjustLabel = label.charAt(0).toUpperCase() + label.slice(1);
        adjustLabel = adjustLabel.replace('_', ' ')
        return adjustLabel
      }
    },
    handleCLick(row: any, column: any, event: any){
      console.log(row)
      this.currentItemDetail = {...row}
    },
    async getItems() {
      this.dsItems = await itemService.getItems(
          this.id as string,
          this.ds_id as string,
          this.getItemsParameters
      )
      if (this.dsItems){
        await this.getFields()
        this.currentItemDetail = this.dsItems.items[0]
      }
      this.tableLoading.close()
    },
    async getFields(){
      const fieldInfo = await datastoreService.getFields(this.ds_id as string, this.id as string)
      console.log(fieldInfo)
      const idArray = Object.keys(fieldInfo.fields)

      idArray.map(item =>
          this.itemFields.push({
            title: fieldInfo.fields[item].name,
            data_type: fieldInfo.fields[item].dataType,
            field_id: fieldInfo.fields[item].field_id,
            display_id: fieldInfo.fields[item].display_id,
          })
      )
    },
  },
  mounted() {
    this.getItems()
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
