import {createClient} from '@hexabase/hexabase-js'
import {useRuntimeConfig} from "nuxt/app";
export const appService = {
    getAppAndDs,
    createApp,
    // getApplication
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
async function createApp(createProjectParams: any) {
    const hexabase = await initHxbClient()
    const {app, error} = await hexabase.applications.create(createProjectParams)
    return app?.project_id
}

//get application
// async function getApplication(projectId: string) {
//     const hexabase = await initHxbClient()
//     const {project, error} = await hexabase.applications.get(projectId)
//     return project
// }