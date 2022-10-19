import {createClient} from '@hexabase/hexabase-js'
import {useRuntimeConfig} from "nuxt/app";
import {CreateProjectPl} from "@hexabase/hexabase-js/src/lib/types/application";
export const appService = {
    getAppAndDs,
    createApp,
    getApplication,
    getTemplates
};
async function initHxbClient () {
    const token = JSON.parse(localStorage.getItem("user")!).token
    const config = useRuntimeConfig()
    const hexabase = await createClient({url: config.public.baseUrl, token})
    return hexabase
}

//get projects and datastores
async function getAppAndDs(id: string) {
    const hexabase = await initHxbClient()
    const {appAndDs, error} = await hexabase.applications.getProjectsAndDatastores(id)
    return appAndDs
}

//create project
async function createApp(createProjectParams: CreateProjectPl) {
    const hexabase = await initHxbClient()
    const {app, error} = await hexabase.applications.create(createProjectParams)
    return app?.project_id
}

//get create application templates
async function getTemplates() {
    const hexabase = await initHxbClient()
    const {getTemplates, error} = await hexabase.applications.getTemplates()
    return getTemplates
}

// get application
async function getApplication(projectId: string) {
    const hexabase = await initHxbClient()
    const {getApplications, error} = await hexabase.applications.get(projectId)
    return getApplications
}