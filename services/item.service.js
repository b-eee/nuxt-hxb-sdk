// import { BehaviorSubject } from 'rxjs';
import {createClient} from '@hexabase/hexabase-js' 

export const itemService = {
    getItems,
    getItemDetail,
    getHistories,
    createItemId,
    getItemRelated,
    createItem,
    deleteItem,
    updateItem,
    executeItem
};


//get item
async function getItems(url, projectId, datastoreId, getItemsParameters) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {dsItems, error} = await hexabase.items.get(getItemsParameters, datastoreId, projectId)
    return dsItems
}

// get detail item
async function getItemDetail(url, datastoreId, itemId, projectId, itemDetailParams) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {itemDetails, error} = await hexabase.items.getItemDetail(datastoreId, itemId, projectId, itemDetailParams)
    return itemDetails
}

// get histories
async function getHistories(url, projectId, datastoreId, historyParams, itemId) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {itemHistories, error} = await hexabase.items.getHistories(projectId, datastoreId, itemId, historyParams)
    return itemHistories
}

//create item id
async function createItemId(url, datastoreId) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {item_id, error} = await hexabase.items.createItemId(datastoreId)
    return item_id
}

//create item
async function createItem(url, projectId, datastoreId, newItemPl) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {itemNew, error} = await hexabase.items.getHistories(projectId, datastoreId, newItemPl)
    return itemNew
}

//get item related
async function getItemRelated(url, datastoreId, itemId, linkedDatastoreId) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {itemLinked, error} = await hexabase.items.getItemRelated(datastoreId, itemId, linkedDatastoreId)
    return itemLinked
}

//delete item
async function deleteItem(url, projectId, datastoreId, itemId, deleteItemReq) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {data, error} = await hexabase.items.delete(projectId, datastoreId, itemId, deleteItemReq)
    return data
}

//update item
async function updateItem(url, projectId, datastoreId, itemId, itemActionParameters) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {data, error} = await hexabase.items.update(projectId, datastoreId, itemId, itemActionParameters)
    return data
}

//execute
async function executeItem(url, projectId, datastoreId, itemId, actionId, itemActionParameters) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {data, error} = await hexabase.items.getItemRelated(projectId, datastoreId, itemId, actionId, itemActionParameters )
    return data
}