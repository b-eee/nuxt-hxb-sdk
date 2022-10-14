<template>
  <el-card class="box-card">
    <template #header>
      <div class="tableTitle">Datastore</div>
    </template>
    <div>
      <el-table :data="DatastoreItems.items" :fit="true" ref="table">
        <el-table-column prop="index" type="index" label="No" width="50"></el-table-column>
        <el-table-column prop="id" label="Display id">
          <template #default="scope">
            <el-space direction="vertical" >
              <nuxt-link :href="`${dsid}/datastore_item/${scope.row.i_id}`">
<!--                ${scope.row.i_id}-->
                {{ scope.row.title ? scope.row.title : scope.row.i_id }}
              </nuxt-link>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title" width="250"></el-table-column>
        <el-table-column prop="i_id" label="Datastore item id" width="250"></el-table-column>
        <el-table-column prop="status_id" label="Status id" width="300"></el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script lang="ts">
import {useRoute, useRuntimeConfig} from "nuxt/app";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElSpace,
  ElCard,
  ElLoading,
} from "element-plus";
import {defineComponent} from "vue";
import {ItemType} from "~/pages/datastore/[ds_id]/item/type";
import {definePageMeta} from "#imports";
import auth from "~/middleware/auth";
import {itemService} from "~/services";

definePageMeta({
  middleware: auth
})

export default defineComponent({
  name: "datastore",
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElSpace,
    ElCard,
    ElLoading
  },
  data() {
    interface GetItemParamType {
      url: string,
      pid: string,
      dsid: string
    }

    interface DatastoreItemType {
      items: ItemType[],
      totalItems: number
    }

    const config = useRuntimeConfig();
    const route = useRoute()
    const baseUrl = config.public.baseUrl;
    const urParse = window.location.origin.toString()
    const {id, dsid} = route.params
    console.log(route.params)
    return {
      id,
      dsid,
      baseUrl,
      DatastoreItems: {
        items: [],
        totalItems: 0
      },
      urParse
    }
  },
  methods: {
    async getItems(pid: string, dsid: string) {
      const tableLoading = ElLoading.service({
        target: 'table'
      })
      let getItemsParameters = {
        page: 1,
        per_page: 20
      }
      const dsItems = await itemService.getItems(pid, dsid, getItemsParameters)
      if (dsItems) {
        this.DatastoreItems = dsItems
      }
      tableLoading.close()
    }
  },
  mounted() {
    this.getItems(this.id as string, this.dsid as string)
  }
})
</script>

<style scoped>
.tableTitle {
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 2rem;
}
</style>