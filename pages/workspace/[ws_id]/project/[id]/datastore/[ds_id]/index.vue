<template>
  <el-card class="box-card">
    <template #header>
      <div
        class="card-header"
        style="display: flex; justify-content: space-between"
      >
        <span class="tableTitle">Item</span>
        <span>
          <el-button type="primary" @click="handleOpenCreatItemModal"
            >Create Item</el-button
          >
        </span>
      </div>
    </template>
    <el-row :gutter="12">
      <el-col :span="viewDetail ? 18 : 24">
        <el-table
          ref="table"
          :data="dsItems?.items"
          style="width: 100%"
          @row-click="(row) => handleCLick(row)"
          :highlight-current-row="true"
        >
          <el-table-column
            v-for="field in itemFieldsExceptFile"
            :key="field.field_id"
            :prop="field.display_id"
            :label="getLabel(field.title)"
          >
            <template #default="scope">
              <!--              <p v-if="field.data_type === 'datetime'">-->
              <!--                {{ dateFormat(scope.row[field.field_id]) }}-->
              <!--              </p>-->
              <!--              <p v-if="field.data_type === 'text'">{{ scope.row[field.field_id] }}</p>-->
              <!--              <p v-if="field.data_type === 'status'">{{ scope.row[field.field_id] }}</p>-->
              <p v-if="!(field.data_type === 'file')">
                {{ scope.row[field.field_id] }}
              </p>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <el-space :size="12">
                <el-button
                  type="outlined"
                  @click="handleOpenUpdateModal(scope.row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-popover trigger="click" width="fit-content">
                  <p>Are you sure to delete this?</p>
                  <el-space style="width: 100%">
                    <el-button
                      type="warning"
                      @click.stop="() => deleteItem(scope.row)"
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
      <el-col :span="viewDetail ? 6 : 0">
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
          "
        >
          {{ currentItemDetail.title }}
          <el-button @click="viewDetail = false">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <el-tabs style="height: 600px; overflow-y: scroll; overflow-x: hidden">
          <el-tab-pane label="Fields">
            <el-descriptions
              :column="1"
              direction="vertical"
              border
              ref="description"
            >
              <div>
                <template
                  v-for="field in currentItemDetail.field_values"
                  :key="field.field_id"
                >
                  <el-descriptions-item
                    :label="field?.field_name"
                    v-if="field.dataType !== 'file'"
                  >
                    <p v-if="field?.field_name === 'Status'">
                      <template>
                        {{
                          statusOptions.find((s) => s.status_id === field.value)
                            ?.displayed_name
                        }}
                      </template>
                    </p>
                    <p v-if="field?.field_name === 'user_id'">
                      <template v-for="i in field.value">
                        {{ i.user_name }}
                      </template>
                    </p>
                    <p v-else>
                      {{ field.value }}
                    </p>
                  </el-descriptions-item>
                </template>
              </div>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="Media">
            <div
              ref="itemLink"
              style="display: flex; flex-direction: column; gap: 5px"
            >
              <template
                v-for="field in currentItemDetail.field_values"
                :key="field.field_id"
                style="margin-bottom: 5px"
              >
                <div v-if="field.dataType === 'file'">
                  <template v-for="file in field.value" :key="file.file_id">
                    <el-button type="link" @click="downloadFile(file)">{{
                      file.filename
                    }}</el-button>
                  </template>
                </div>
              </template>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-card>
  <!--  create item modal-->
  <el-dialog
    v-model="visible"
    title="Create new item"
    width="60%"
    @close="handleCloseModal"
    ref="createModal"
  >
    <el-form
      v-model="createItemParams"
      class="demo-form-inline"
      label-position="right"
      label-width="100px"
    >
      <template v-for="field in itemFields" :key="field.field_id">
        <div style="display: flex">
          <div style="flex-grow: 1; margin-right: 20px">
            <el-form-item :label="getLabel(field.title)">
              <el-input
                v-if="
                  !['status', 'datetime', 'file', 'users'].includes(
                    field.data_type
                  )
                "
                v-model="createItemParams[field.field_id]"
              />
              <el-select
                v-model="createItemParams[field.field_id]"
                placeholder="Select status"
                v-if="field.data_type === 'status'"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.status_id"
                  :label="item.displayed_name"
                  :value="item.status_id"
                />
              </el-select>
              <el-select
                v-if="field.data_type === 'users'"
                v-model="selectedUser"
                @change="createItemParams[field.field_id] = [selectedUser]"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-if="field.data_type === 'datetime'"
                v-model="createItemParams[field.field_id]"
                type="datetime"
                :placeholder="`Please input ${field.title.toLowerCase()}`"
                format="YYYY/MM/DD HH:mm:ss"
              />
              <input
                v-if="field.data_type === 'file'"
                @input="(e) => createUploadFile(e, field)"
                type="file"
              />
            </el-form-item>
          </div>
        </div>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModal">Cancel</el-button>
        <el-button type="primary" @click="() => createItem()">Add</el-button>
      </span>
    </template>
  </el-dialog>
  <!--  update item modal-->
  <el-dialog
    v-model="visibleUpdate"
    title="Update item"
    width="60%"
    @close="handleCloseModalUpdate"
    :before-close="warningCloseUpdateModal"
    ref="updateModal"
  >
    <el-form
      class="demo-form-inline"
      label-position="right"
      label-width="100px"
    >
      <template v-for="(field, index) in itemFields" :key="field.field_id">
        <div style="display: flex">
          <div style="flex-grow: 1; margin-right: 20px">
            <el-form-item
              :label="getLabel(field.title)"
              v-if="field.data_type !== 'file'"
            >
              <el-input
                v-model="updateItemDetail[field.field_id]"
                @change="(value) => getUpdateItemChanges(field, value)"
                :placeholder="`Please input ${field.title.toLowerCase()}`"
                :autofocus="index === 0"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="getLabel(field.title)"
              v-else
              style="width: 100%; display: flex; align-items: center"
            >
              <div
                v-for="field in currentItemDetail.field_values"
                :key="field.field_id"
              >
                <span
                  v-if="
                    field.dataType === 'file' &&
                    field.value &&
                    field.value[0] &&
                    field.value[0].filename
                  "
                  style="margin-right: 5px"
                >
                  <span
                    v-for="file in field.value"
                    :key="file.file_id"
                    style="margin-right: 10px"
                  >
                    <el-button
                      type="link"
                      style="
                        margin-left: 0;
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        border-right: none;
                      "
                    >
                      {{ file.filename }}
                    </el-button>
                    <el-button
                      @click="deleteFile(file)"
                      style="
                        margin-left: 0;
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                        /* border-left: none; */
                      "
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </span>
                </span>
              </div>
              <!-- v-model="updateItemDetail[field.field_id]" -->
              <input
                style="margin: 20px"
                @change="(e) => handleChangeFile(e, field)"
                type="file"
              />
            </el-form-item>
          </div>
        </div>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModalUpdate">Cancel</el-button>
        <el-button type="primary" @click="() => updateItem()">Update</el-button>
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
  ElPopover,
  ElTabs,
  ElTabPane,
  ElMessageBox,
  Action,
  ElUpload,
  UploadProps,
  ElMessage,
  UploadUserFile,
} from "element-plus";
import moment from "moment";
import { useRoute, useRuntimeConfig } from "#imports";
import { defineComponent, ref } from "vue";
import { itemService } from "~/services";
import { DsItems } from "@hexabase/hexabase-js/dist/lib/types/item";
import { datastoreService } from "~/services/datastore.service";
import { DsAction } from "@hexabase/hexabase-js/src/lib/types/datastore/response";
import { Delete, Edit, Close, Upload } from "@element-plus/icons-vue";
import {
  DeleteItemReq,
  GetItemDetailPl,
} from "@hexabase/hexabase-js/src/lib/types/item/input";
import { GetItemsPlType, ItemFieldType } from "./type";
import { ItemDetail } from "@hexabase/hexabase-js/src/lib/types/item/response";
import { storageService } from "~/services/storage.service";
import { toBase64 } from "~/services/helper";
import { ItemFileAttachmentPl } from "@hexabase/hexabase-js/src/lib/types/storage/input";

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
    ElPopover,
    Close,
    ElTabs,
    ElTabPane,
    Upload,
    ElUpload,
  },
  name: "Item Detail",
  layout: "default",
  setup() {
    const urParse = window.location.origin.toString();
    const successNotif = (message?: string) => {
      ElNotification({
        title: "Success",
        message: message || "Item created",
        type: "success",
      });
    };
    const leaveUpdateWarning = () => {
      ElMessageBox.alert("Those updates will be removed", "Wait!", {
        // if you want to disable its autofocus
        confirmButtonText: "OK",
        callback: (action: Action) => {
          console.log("hi");
        },
      });
    };
    const errorMessage = () => {
      ElMessage({
        showClose: true,
        message: "You have to update item after delete a file.",
        type: "warning",
      });
    };
    return {
      errorMessage,
      leaveUpdateWarning,
      urParse,
      successNotif,
    };
  },
  data() {
    const route = useRoute();
    const { ws_id, id, ds_id } = route.params;
    const config = useRuntimeConfig();
    const url = config.public.baseUrl;
    let getItemsParameters: GetItemsPlType = {
      use_or_condition: false,
      sort_field_id: "",
      page: 1,
      per_page: 20,
    };
    let getItemDetailParams: GetItemDetailPl = {
      include_lookups: true,
      use_display_id: true,
      return_number_value: true,
      format: "",
      include_linked_items: true,
    };
    return {
      visible: false,
      getItemsParameters,
      getItemDetailParams,
      ds_id,
      id,
      ws_id,
      url,
      dsItems: {} as DsItems | undefined,
      itemFields: [] as ItemFieldType[],
      itemFieldsExceptFile: [] as any,
      currentItemDetail: {} as ItemDetail,
      updateItemDetail: {} as any,
      createItemParams: {} as any,
      viewDetail: false,
      itemFile: "" as any,
      addItemFile: "" as any,
      curImg: "",
      curItemId: "",
      visibleUpdate: false,
      base64String: "" as any,
      updateItemChanges: [] as any,
      fieldsLayout: {} as any,
      fieldSettings: {},
      newFileId: "",
      statusOptions: [] as any,
      curUserId: "",
      curUserName: {} as any,
      userOptions: [] as any,
      selectedUser: "",
    };
  },
  computed: {},
  methods: {
    async handleOpenCreatItemModal() {
      this.visible = true;
      this.createItemParams.item_id = (await itemService.createItemId(
        this.ds_id as string
      )) as string;
    },
    async getStatus() {
      const dsStatus = await datastoreService.getStatuses(this.ds_id as string);
      this.statusOptions = dsStatus;
    },
    async createUploadFile(e: any, field: any) {
      const file = e.target.files[0];
      const filename = file.name;
      const extension = file.type;
      const toBase64File = await toBase64(file);
      console.log("create file tobase64", toBase64File);
      const payload = {
        filename,
        contentTypeFile: extension,
        filepath: `${this.ds_id}/${this.curItemId}/${field.field_id}/${filename}`,
        content: toBase64File,
        d_id: this.ds_id,
        p_id: this.id,
        field_id: field.field_id,
        item_id: this.createItemParams.item_id,
        display_order: 0,
      } as ItemFileAttachmentPl;
      const createFileRes = await storageService.createFile(payload);
      this.createItemParams[field.field_id] = [
        ...(this.createItemParams[field.field_id] || []),
        createFileRes?.file_id,
      ];
    },
    async deleteFile(file: any) {
      const field = this.itemFields.find((i) => i.data_type === "file");
      const updateLoad = ElLoading.service({
        target: "updateModal",
      });
      const fileId = file.file_id;
      try {
        await storageService.deleteFile(fileId);
        this.successNotif("file deleted successfully");
        this.errorMessage();
        await this.getUpdateItemChanges(field, "", file.file_id);
      } catch (error) {
        console.log(error);
      } finally {
        updateLoad.close();
      }
    },
    warningCloseUpdateModal(done: () => void) {
      if (this.updateItemChanges[0]) {
        ElMessageBox.confirm("Those updates will be removed")
          .then(() => {
            done();
          })
          .catch(() => {
            // catch error
          });
      } else {
        done();
      }
    },
    async updateItem() {
      const updateLoad = ElLoading.service({
        target: "updateModal",
      });
      const updateActionId =
        this.currentItemDetail.item_actions.UpdateItem.a_id;
      const itemActionParameters = {
        changes: this.updateItemChanges,
        history: {
          comment: "",
          datastore_id: this.ds_id as string,
          action_id: updateActionId,
        },
        rev_no: this.currentItemDetail.rev_no,
      };

      try {
        const data = await itemService.updateItem(
          this.id as string,
          this.ds_id as string,
          this.curItemId,
          itemActionParameters
        );
        this.successNotif("update successfully");
      } catch (error) {
        console.log(error);
      } finally {
        this.visibleUpdate = false;
        this.viewDetail = false;
        updateLoad.close();
      }
    },
    async getUpdateItemChanges(field: any, value: any, deletedFiled?: string) {
      const keyArr = Object.keys(this.currentItemDetail.field_values);
      const keyFile = keyArr.find(
        (i) => this.currentItemDetail.field_values[i].dataType === "file"
      );
      let fileIds = [] as any;
      if (keyFile) {
        const objectHasFile =
          this.currentItemDetail.field_values[keyFile as string];
        fileIds =
          (objectHasFile.value &&
            objectHasFile.value.map((i: any) => i.file_id)) ||
          [];
      }
      if (deletedFiled) {
        console.log("fileIds in delete fileeee", fileIds);
        fileIds = fileIds.filter((f: string) => f !== deletedFiled);
      }

      const fieldSettings = await datastoreService.getDetail(
        this.ds_id as string
      );
      let idx: number | undefined = 0;
      if (fieldSettings && fieldSettings.fields) {
        idx = fieldSettings.fields.find(
          (s: any) => s.id === field.field_id
        )?.field_index;
      }
      const fieldIdLayout = this.fieldsLayout[field.field_id];
      const fieldId = this.itemFields.find(
        (f: any) => f.field_id === field.field_id
      );
      if (fieldIdLayout && (fieldId || deletedFiled)) {
        const tabindex = (fieldIdLayout.row + 1) * 10 + fieldIdLayout.col;
        let objectChange = {};
        if (field.data_type === "file") {
          objectChange = {
            as_title: fieldId?.as_title,
            cols: fieldIdLayout.sizeX,
            dataType: "file",
            id: field.field_id,
            idx,
            rowHeight: "item.rowHeight",
            rows: fieldIdLayout.sizeY,
            status: false,
            tabindex,
            title: this.currentItemDetail.title,
            unique: fieldId?.unique,
            x: fieldIdLayout.col,
            y: fieldIdLayout.row,
            post_file_ids: value ? [...fileIds, value] : [...fileIds],
            value: value ? [...fileIds, value] : [...fileIds],
          };
        } else {
          objectChange = {
            as_title: fieldId?.as_title,
            cols: fieldIdLayout.sizeX,
            dataType: field.data_type,
            id: field.field_id,
            idx,
            rowHeight: "item.rowHeight",
            rows: fieldIdLayout.sizeY,
            status: false,
            tabindex,
            title: this.currentItemDetail.title,
            unique: fieldId?.unique,
            value,
            x: fieldIdLayout.col,
            y: fieldIdLayout.row,
          };
        }
        this.updateItemChanges.push(objectChange);
      }
      await this.fetchItemDetail();
    },
    async handleChangeFile(e: any, field: any) {
      const tableLoading = ElLoading.service({
        target: "updateModal",
      });
      const file = e.target.files[0];
      const filename = file.name;
      const extension = file.type;
      const toBase64File = await toBase64(file);
      const payload = {
        filename,
        contentTypeFile: extension,
        filepath: `${this.ds_id}/${this.curItemId}/${field.field_id}/${filename}`,
        content: toBase64File,
        d_id: this.ds_id,
        p_id: this.id,
        field_id: field.field_id,
        item_id: this.curItemId,
        display_order: 0,
      } as ItemFileAttachmentPl;
      const createFileRes = await storageService.createFile(payload);
      const newFileId = createFileRes?.file_id;
      if (newFileId) {
        this.newFileId = newFileId;
      }
      await this.getUpdateItemChanges(field, newFileId);
      tableLoading.close();
    },
    dateFormat(dateString: string) {
      return moment(dateString).format("YYYY-MM-DD hh:mm:ss");
    },

    async createItem() {
      let dsActions: [DsAction];
      let actionIdCreate: string | undefined = "";
      const res = await datastoreService.getActions(this.ds_id as string);
      if (res) {
        dsActions = res;
        actionIdCreate = dsActions.find(
          (action) => action?.operation?.trim().toLowerCase() === "new"
        )?.action_id;
      }

      const newItemPl = {
        action_id: actionIdCreate,
        use_display_id: true,
        return_item_result: true,
        ensure_transaction: false,
        exec_children_post_procs: true,
        access_key_updates: {
          overwrite: true,
          ignore_action_settings: true,
        },
        item: this.createItemParams,
      };
      const newItem = await itemService.createItem(
        this.id as string,
        this.ds_id as string,
        newItemPl
      );
      this.visible = false;
      if (newItem) {
        this.successNotif();
        await this.getItems();
      }
    },

    async deleteItem(row: any) {
      const tableLoading = ElLoading.service({
        target: "table",
      });
      let dsActions: [DsAction];
      let actionIdDelete: string | undefined = "";
      const res = await datastoreService.getActions(this.ds_id as string);
      if (res) {
        dsActions = res;
        actionIdDelete = dsActions.find(
          (action) => action?.operation?.trim().toLowerCase() === "delete"
        )?.action_id;
      }
      if (actionIdDelete) {
        const deleteItemReq: DeleteItemReq = {
          a_id: actionIdDelete,
          use_display_id: true,
          delete_linked_items: true,
        };
        await itemService.deleteItem(
          this.id as string,
          this.ds_id as string,
          row.i_id,
          deleteItemReq
        );
      }

      this.visible = false;
      this.successNotif("Item deleted successfully");
      await this.getItems();
      tableLoading.close();
    },

    handleCloseModal() {
      this.visible = false;
      this.createItemParams = {};
    },

    async handleOpenUpdateModal(row: any) {
      this.visibleUpdate = true;
      const tableLoading = ElLoading.service({
        target: "updateModal",
      });
      this.curItemId = row.i_id;
      this.updateItemDetail = this.dsItems?.items.find(
        (i: any) => i.i_id === this.curItemId
      );
      await this.fetchItemDetail();
      tableLoading.close();
    },

    async fetchItemDetail() {
      const tableLoading = ElLoading.service({
        target: "table",
      });
      const res = await itemService.getItemDetail(
        this.ds_id as string,
        this.curItemId,
        this.id as string,
        this.getItemDetailParams
      );

      if (res) {
        this.currentItemDetail = res;
        tableLoading.close();
      }
    },

    handleCloseModalUpdate() {
      this.visibleUpdate = false;
    },
    //row click
    async handleCLick(row: any) {
      this.curItemId = row.i_id;
      this.viewDetail = true;
      const desLoad = ElLoading.service({
        target: "description",
      });
      await this.fetchItemDetail();
      const result = this.currentItemDetail.field_values.user_id.value;
      this.userOptions = result.map((r: any) => {
        return {
          label: r.user_name,
          value: r.user_id,
        };
      });
      console.log(result);
      console.log(this.userOptions);
      desLoad.close();
    },

    //adjust label: capitalize first character, remove underscore
    getLabel(label: string) {
      let idLabelArr = this.itemFields.map((i) => i.field_id);
      if (idLabelArr.includes(label)) {
        const altLabel =
          this.itemFields.find((i) => i.field_id === label)?.title || "";
        return altLabel.charAt(0).toUpperCase() + altLabel.slice(1);
      } else {
        let adjustLabel = label.charAt(0).toUpperCase() + label.slice(1);
        adjustLabel = adjustLabel.replace("_", " ");
        return adjustLabel;
      }
    },

    async getItems() {
      this.dsItems = await itemService.getItems(
        this.id as string,
        this.ds_id as string,
        this.getItemsParameters
      );
    },

    // async downloadFile(file: any) {
    //   console.log("fileField", file);
    //   const getFile = await storageService.getFile(file.file_id);
    //   this.curImg = getFile;
    //   console.log("curImg", this.curImg);
    //   itemService.download(getFile, file.filename, file.contentType);
    // },

    async downloadFile(file: any) {
      const res = await storageService.getFile(file.file_id);
      if (res?.data) {
        let a = document.createElement("a");
        const realData = res.data.split("/").slice(2).join("/");
        a.href = `data:${file.contentType};base64,/${realData}`;
        if (res.filename) {
          a.download = res.filename;
        }
        a.click();
      }
    },

    //get to-show column title and input field
    async getFields() {
      const fieldInfo = await datastoreService.getFields(
        this.ds_id as string,
        this.id as string
      );
      if (fieldInfo) {
        this.fieldsLayout = fieldInfo.field_layout;
        const idArray = Object.keys(fieldInfo.fields);
        idArray.map((item) =>
          this.itemFields.push({
            title: fieldInfo.fields[item].name,
            data_type: fieldInfo.fields[item].dataType,
            field_id: fieldInfo.fields[item].field_id,
            display_id: fieldInfo.fields[item].display_id,
            as_title: fieldInfo.fields[item].as_title,
            unique: fieldInfo.fields[item].unique,
          })
        );

        this.itemFieldsExceptFile = this.itemFields.filter(
          (i) => i.data_type !== "file"
        );
      }
    },
  },
  mounted() {
    this.getItems();
    this.getFields();
    this.getStatus();
  },
});
</script>

<style scoped>
.tableTitle {
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 2rem;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
