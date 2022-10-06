// import { BehaviorSubject } from 'rxjs';
import {
    DeleteItemReq,
    GetItemDetailPl,
    GetItemsPl,
    ItemActionParameters
} from "@hexabase/hexabase-js/src/lib/types/item/input";
import {GetHistoryPl} from "@hexabase/hexabase-js/dist/lib/types/item";
import {createClient} from "@hexabase/hexabase-js";
import {useRuntimeConfig} from "nuxt/app";

export const itemService = {
    getItems,
    // getItemDetail,
    // getHistories,
    // createItemId,
    // getItemRelated,
    // createItem,
    // deleteItem,
    // updateItem,
    // executeItem
};

async function initHxbClient () {
    const token = JSON.parse(localStorage.getItem("user")!).token
    const config = useRuntimeConfig()
    const hexabase = await createClient({url: useRuntimeConfig().public.baseUrl, token})
    return hexabase
}

//get item
async function getItems( projectId: string, datastoreId: string, getItemsParameters: GetItemsPl) {
    const hexabase = await initHxbClient()
    const {dsItems, error} = await hexabase.items.get(getItemsParameters, datastoreId, projectId)
    return dsItems
}

// get detail item
async function getItemDetail( datastoreId: string, itemId: string, projectId: string, itemDetailParams: GetItemDetailPl) {
    const hexabase = await initHxbClient()
    const {itemDetails, error} = await hexabase.items.getItemDetail(datastoreId, itemId, projectId, itemDetailParams)
    return itemDetails
}

// get histories
async function getHistories( projectId: string, datastoreId: string, historyParams: GetHistoryPl, itemId: string) {
    const hexabase = await initHxbClient()
    const {itemHistories, error} = await hexabase.items.getHistories(projectId, datastoreId, itemId, historyParams)
    return itemHistories
}

//create item id
async function createItemId(datastoreId: string) {
    const hexabase = await initHxbClient()
    const {item_id, error} = await hexabase.items.createItemId(datastoreId)
    return item_id
}

//create item
async function createItem( projectId: string, datastoreId: string, newItemPl: string) {
    const hexabase = await initHxbClient()
    const {itemHistories, error} = await hexabase.items.getHistories(projectId, datastoreId, newItemPl)
    return itemHistories
}

//get item related
async function getItemRelated( datastoreId: string, itemId: string, linkedDatastoreId: string) {
    const hexabase = await initHxbClient()
    const {itemLinked, error} = await hexabase.items.getItemRelated(datastoreId, itemId, linkedDatastoreId)
    return itemLinked
}

//delete item
async function deleteItem( projectId: string, datastoreId: string, itemId: string, deleteItemReq: DeleteItemReq) {
    const hexabase = await initHxbClient()
    const {data, error} = await hexabase.items.delete(projectId, datastoreId, itemId, deleteItemReq)
    return data
}

//update item
async function updateItem( projectId: string, datastoreId: string, itemId: string, itemActionParameters: ItemActionParameters) {
    const hexabase = await initHxbClient()
    const {data, error} = await hexabase.items.update(projectId, datastoreId, itemId, itemActionParameters)
    return data
}

//execute
// async function executeItem( projectId: string, datastoreId: string, itemId: string, actionId: any, itemActionParameters: any) {
//     const hexabase = await initHxbClient()
//
//     const {data, error} = await hexabase.items.getItemRelated(projectId, datastoreId, itemId, actionId, itemActionParameters )
//     return data
// }