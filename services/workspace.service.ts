import {QueryTaskList} from "@hexabase/hexabase-js/src/lib/types/workspace/input";
import {createClient, HexabaseClient} from "@hexabase/hexabase-js";
import {useRuntimeConfig} from "nuxt/app";
export const workspaceService = {
    getWorkspaces,
    setWorkspace,
    createWorkspace,
    getPasswordPolicy,
    getFunctionality,
    getUsage,
    getGroupChildren,
    getTaskQueueList,
    getTaskQueueStatus,
};

async function initHxbClient () {
    const token = JSON.parse(localStorage.getItem("user")!).token
    const hexabase = token && await createClient({url: useRuntimeConfig().public.baseUrl, token})
    return hexabase
}

// get all workspaces
async function getWorkspaces() {
    const hexabase = await initHxbClient()
    const {workspaces, error} = await hexabase.workspaces.get()
    return workspaces
}

// set workspace current id
async function setWorkspace(id: string) {
    const setCurrentWsPl = {
        workspace_id: id
    }
    const hexabase = await initHxbClient()
    const {data, error} = await hexabase.workspaces.setCurrent(setCurrentWsPl)
    return data

}

//create a workspace
async function createWorkspace(name: string){
    const createWsInput = {
        name
    }
    const hexabase = await initHxbClient()
    const {w_id, error} = await hexabase.workspaces.create(createWsInput)
    return w_id
}

//get password policy
async function getPasswordPolicy(workspaceId: string){
    const hexabase = await initHxbClient()
    const {wsPasswordPolicy, error} = await hexabase.workspaces.getPasswordPolicy(workspaceId)
    return wsPasswordPolicy
}

//get functionality
async function getFunctionality(workspaceId: string){
    const hexabase = await initHxbClient()
    const {wsFunctionality, error} = await hexabase.workspaces.getFunctionality(workspaceId)
    return wsFunctionality
}

//get usage
async function getUsage(workspaceId: string){
    const hexabase = await initHxbClient()
    const {wsUsage, error} = await hexabase.workspaces.getUsage(workspaceId)
    return wsUsage
}

//get group children
async function getGroupChildren(workspaceId: string){
    const hexabase = await initHxbClient()
    const {wsGroupChildren, error} = await hexabase.workspaces.getGroupChildren(workspaceId)
    return wsGroupChildren
}

//get task queue list
async function getTaskQueueList(workspaceId: string, queryTaskList: QueryTaskList){
    const hexabase = await initHxbClient()
    const {taskQueueList, error} = await hexabase.workspaces.getTaskQueueList(workspaceId, queryTaskList)
    return taskQueueList
}

//get task queue status
async function getTaskQueueStatus(taskId: string, workspaceId: string){
    const hexabase = await initHxbClient()
    const {taskQueueStatus, error} = await hexabase.workspaces.getTaskQueueStatus(taskId, workspaceId)
    return taskQueueStatus
}
