<template>
  <el-card class="box-card">
    <template #header>
      <div
          class="card-header"
          style="display: flex; justify-content: space-between"
      >
        <span class="tableTitle">Item</span>
        <span>
          <el-button type="primary" @click="visible = true">Create Item</el-button>
        </span>
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
              <p v-if="field.data_type === 'datetime'">
                {{ dateFormat(scope.row[field.field_id]) }}
              </p>
<!--              <p v-if="field.data_type === 'text'">{{ scope.row[field.field_id] }}</p>-->
<!--              <p v-if="field.data_type === 'status'">{{ scope.row[field.field_id] }}</p>-->
              <p v-else>{{ scope.row[field.field_id] }}</p>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <el-space :size="12">
                <el-button type="outlined">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-popover trigger="click" width="fit-content">
                  <p>Are you sure to delete this?</p>
                  <el-space style="width: 100%">
                    <el-button type="warning" @click.stop="() => deleteItem(scope.row)"
                    >Confirm</el-button
                    >
                  </el-space>
                  <template #reference>
                    <el-button type="outlined">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </template>
                </el-popover>

              </el-space>
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
    <el-form :model="createItemParams" class="demo-form-inline" label-position="right" label-width="100px">
      <template v-for="(field, index) in itemFields" :key="field.field_id">
        <div style="display: flex">
          <div style="flex-grow: 1; margin-right: 20px">
            <el-form-item :label="field.title">
              <el-input
                  v-if="field.data_type !== 'datetime'"
                  v-model="createItemParams[field.field_id]" :placeholder="`Please input ${field.title.toLowerCase()}`"
                  :autofocus="index === 0"
                  clearable />
              <el-date-picker
                  v-if="field.data_type === 'datetime'"
                  v-model="createItemParams[field.field_id]"
                  type="datetime"
                  :placeholder="`Please input ${field.title.toLowerCase()}`"
                  format="YYYY/MM/DD HH:mm:ss"
              />
            </el-form-item>
          </div>

        </div>
      </template>
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
  ElDatePicker,
  ElPopover
} from "element-plus";
import moment from "moment";
import {useRoute, useRuntimeConfig} from "nuxt/app";
import {defineComponent, ref, unref} from "vue";
import {itemService} from "~/services";
import {DsItems} from "@hexabase/hexabase-js/dist/lib/types/item";
import {datastoreService} from "~/services/datastore.service";
import {DsAction} from "@hexabase/hexabase-js/src/lib/types/datastore/response";
import {Delete, Edit} from "@element-plus/icons-vue";
import {DeleteItemReq} from "@hexabase/hexabase-js/src/lib/types/item/input";
import {GetItemsPlType, ItemFieldType} from "./type";

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
    ElForm,
    ElFormItem,
    ElDatePicker,
    Delete,
    Edit,
    ElPopover
  },
  name: "Workspace",
  layout: "default",
  setup() {
    const {i_id} = useRoute().params
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
      tableLoading,
      successNotif,
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
      visible: false,
      getItemsParameters,
      ds_id,
      id,
      ws_id,
      url,
      dsItems: {} as  DsItems | undefined,
      itemFields: [] as ItemFieldType[],
      currentItemDetail: {},
      createItemParams: {} as any
    };
  },
  computed: {
  },
  methods: {
    dateFormat(dateString: string){
      return moment(dateString).format('YYYY-MM-DD hh:mm:ss')
    },

    async editItem(){
      console.log('的突袭')
    },
    async createItem() {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      const dsActions: DsAction[] = await datastoreService.getActions(this.ds_id as string)
      const actionIdCreate = dsActions.find(action => action?.operation?.trim().toLowerCase() === 'new')?.action_id

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
        item: this.createItemParams
      };
      const newItem = await itemService.createItem(this.id as string, this.ds_id as string, newItemPl);
      this.visible = false;
      if (newItem) {
        this.successNotif()
        await this.getItems()
      }
      tableLoading.close()
    },
    async deleteItem(row: any) {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      const dsActions: DsAction[] = await datastoreService.getActions(this.ds_id as string)
      const actionIdDelete = dsActions.find(action => action?.operation?.trim().toLowerCase() === 'delete')?.action_id
      if (actionIdDelete){
        const deleteItemReq: DeleteItemReq = {
          a_id: actionIdDelete,
          use_display_id: true,
          delete_linked_items: true,
        };
        await itemService.deleteItem(this.id as string, this.ds_id as string, row.i_id, deleteItemReq);
      }

      this.visible = false;
      this.successNotif('Item deleted successfully')
      await this.getItems()
      tableLoading.close()
    },

    handleCloseModal(){
      this.visible = false,
          this.createItemParams = []
    },
    //row click
    handleCLick(row: any, column: any, event: any){
      this.currentItemDetail = {...row}
    },

    //adjust label: capitalize first character, remove underscore
    getLabel(label: string){
      const idLabelArr = this.itemFields.map(i => i.field_id)
      if(idLabelArr.includes(label)){
        const altLabel = this.itemFields.find(i => i.field_id === label)?.display_id || ""
        return altLabel.charAt(0).toUpperCase() + altLabel.slice(1);
      }
      else {
        let adjustLabel = label.charAt(0).toUpperCase() + label.slice(1);
        adjustLabel = adjustLabel.replace('_', ' ')
        return adjustLabel
      }
    },
    async getItems() {
      this.dsItems = await itemService.getItems(
          this.id as string,
          this.ds_id as string,
          this.getItemsParameters
      )
      if (this.dsItems){
        this.currentItemDetail = this.dsItems.items[0]
      }
      this.tableLoading.close()
    },
    //get need-to-show column title and input field
    async getFields(){
      const fieldInfo = await datastoreService.getFields(this.ds_id as string, this.id as string)
      console.log("fieldInfo", fieldInfo)
      const idArray = Object.keys(fieldInfo.fields)
      idArray.map(item =>
          this.itemFields.push({
            title: fieldInfo.fields[item].name,
            data_type: fieldInfo.fields[item].dataType,
            field_id: fieldInfo.fields[item].field_id,
            display_id: fieldInfo.fields[item].display_id,
          })
      )
      console.log("itemFields", this.itemFields)
      this.itemFields.forEach(i => {
        this.createItemParams[i.field_id] = ""
      })

      console.log("createItemParams", this.createItemParams)
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
