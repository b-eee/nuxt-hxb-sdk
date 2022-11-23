// import { BehaviorSubject } from 'rxjs';
import {
  CreateNewItemPl,
  DeleteItemReq,
  GetItemDetailPl,
  GetItemsPl,
  ItemActionParameters,
} from "@hexabase/hexabase-js/src/lib/types/item/input";
import { Buffer } from "buffer";
import { GetHistoryPl } from "@hexabase/hexabase-js/dist/lib/types/item";
import { createClient, HexabaseClient } from "@hexabase/hexabase-js";
import { useRuntimeConfig } from "#imports";

export const itemService = {
  getItems,
  getItemDetail,
  getHistories,
  createItemId,
  getItemRelated,
  createItem,
  deleteItem,
  updateItem,
  // executeItem
};

async function initHxbClient() {
  const token = JSON.parse(localStorage.getItem("user")!).token;
  const config = useRuntimeConfig();
  const hexabase: HexabaseClient = await createClient({
    url: useRuntimeConfig().public.baseUrl,
    token,
  });
  return hexabase;
}

//get datastore_item
async function getItems(
  projectId: string,
  datastoreId: string,
  getItemsParameters: GetItemsPl
) {
  const hexabase = await initHxbClient();
  const { dsItems, error } = await hexabase.item.get(
    getItemsParameters,
    datastoreId,
    projectId
  );
  return dsItems;
}

// get detail datastore_item
async function getItemDetail(
  datastoreId: string,
  itemId: string,
  projectId: string,
  itemDetailParams: GetItemDetailPl
) {
  const hexabase = await initHxbClient();
  const { itemDetails, error } = await hexabase.item.getItemDetail(
    datastoreId,
    itemId,
    projectId,
    itemDetailParams
  );
  return itemDetails;
}

// get histories
async function getHistories(
  projectId: string,
  datastoreId: string,
  historyParams: GetHistoryPl,
  itemId: string
) {
  const hexabase = await initHxbClient();
  const { itemHistories, error } = await hexabase.item.getHistories(
    projectId,
    datastoreId,
    itemId,
    historyParams
  );
  return itemHistories;
}

//create datastore_item id
async function createItemId(datastoreId: string) {
  const hexabase = await initHxbClient();
  const { item_id, error } = await hexabase.item.createItemId(datastoreId);
  return item_id;
}

//create datastore_item
async function createItem(
  projectId: string,
  datastoreId: string,
  newItemPl: CreateNewItemPl
) {
  const hexabase = await initHxbClient();
  const { itemNew, error } = await hexabase.item.create(
    projectId,
    datastoreId,
    newItemPl
  );
  return itemNew;
}

//get datastore_item related
async function getItemRelated(
  datastoreId: string,
  itemId: string,
  linkedDatastoreId: string
) {
  const hexabase = await initHxbClient();
  const { itemLinked, error } = await hexabase.item.getItemRelated(
    datastoreId,
    itemId,
    linkedDatastoreId
  );
  return itemLinked;
}

//delete datastore_item
async function deleteItem(
  projectId: string,
  datastoreId: string,
  itemId: string,
  deleteItemReq: DeleteItemReq
) {
  const hexabase = await initHxbClient();
  const { data, error } = await hexabase.item.delete(
    projectId,
    datastoreId,
    itemId,
    deleteItemReq
  );
  return data;
}

//update datastore_item
async function updateItem(
  projectId: string,
  datastoreId: string,
  itemId: string,
  itemActionParameters: ItemActionParameters
) {
  const hexabase = await initHxbClient();
  const { data, error } = await hexabase.item.update(
    projectId,
    datastoreId,
    itemId,
    itemActionParameters
  );
  return data;
}

//execute
// async function executeItem( projectId: string, datastoreId: string, itemId: string, actionId: any, itemActionParameters: any) {
//     const hexabase = await initHxbClient()
//
//     const {data, error} = await hexabase.item.getItemRelated(projectId, datastoreId, itemId, actionId, itemActionParameters )
//     return data
// }
