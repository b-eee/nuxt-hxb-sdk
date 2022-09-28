import {createClient} from '@hexabase/hexabase-js'

export const appService = {
    getAppAndDs,
    createApp,
    getReports,
    getDataReport,
    getApplication
};

const user = JSON.parse(localStorage.getItem('user'))

//get projects and datastores
async function getAppAndDs(url, id) {
    const hexabase = await createClient({ url, token: user.token})
    const {appAndDs, error} = await hexabase.applications.getProjectsAndDatastores(id)
    return appAndDs
}

//create project
async function createApp(url, createProjectParams) {
    const hexabase = await createClient({ url, token: user.token})
    const {application, error} = await hexabase.applications.createApp(createProjectParams)
    return application
}

//get reports
async function getReports(url, projectId) {
    const hexabase = await createClient({ url, token: user.token})
    const {application, error} = await hexabase.applications.getReports(projectId)
    return application
}

//get data reports
async function getDataReport(url, projectId, reportId, reportDataPayload) {
    const hexabase = await createClient({ url, token: user.token})
    const {dataReport, error} = await hexabase.applications.getDataReport(projectId, reportId, reportDataPayload)
    return dataReport
}

//get application
async function getApplication(url, projectId) {
    const hexabase = await createClient({ url, token: user.token})
    const {dataReport, error} = await hexabase.applications.get(projectId)
    return dataReport
}