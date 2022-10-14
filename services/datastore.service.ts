import {useRuntimeConfig} from "#app";
import {createClient} from "@hexabase/hexabase-js";

export const datastoreService = {
    getFields,
    getActions
}

async function initHxbClient () {
    const token = JSON.parse(localStorage.getItem("user")!).token
    const hexabase = token && await createClient({url: useRuntimeConfig().public.baseUrl, token})
    return hexabase
}

async function getFields(datastoreId: string, projectId: string) {
    const hexabase = await initHxbClient()
    const {dsFields, error} = await hexabase.datastores.getFields(datastoreId, projectId)
    return dsFields
}

async function getActions(datastoreId: string) {
    const hexabase = await initHxbClient()
    const {dsActions, error} = await hexabase.datastores.getActions(datastoreId)
    return dsActions
}

