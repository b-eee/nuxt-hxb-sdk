import {useRuntimeConfig} from "#app";
import {createClient} from "@hexabase/hexabase-js";

export const datastoreService = {
    getFields
}

async function initHxbClient () {
    const token = JSON.parse(localStorage.getItem("user")!).token
    const hexabase = token && await createClient({url: useRuntimeConfig().public.baseUrl, token})
    return hexabase
}

async function getFields(projectId: string, datastoreId: string) {
    const hexabase = await initHxbClient()
    console.log(hexabase)
    const {dsField, error} = await hexabase.datastores.getFields(projectId, datastoreId)
    return dsField
}