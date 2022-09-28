import { BehaviorSubject } from 'rxjs';
import {createClient} from '@hexabase/hexabase-js'

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

// get all workspaces
async function getWorkspaces(url) {
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {workspaces, error} = await hexabase.workspaces.get()
    return workspaces
}

// set workspace current id
async function setWorkspace(url, id) {
    const user = JSON.parse(localStorage.getItem('user'))
    const setCurrentWsPl = {
        workspace_id: id
    }
    const hexabase = await createClient({ url, token: user.token})
    const {wsCurrent, error} = await hexabase.workspaces.setCurrent(setCurrentWsPl)
    return wsCurrent
}

//create a workspace
async function createWorkspace(url, name){
    const createWsInput = {
        name
    }
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {w_id, error} = await hexabase.workspaces.create(createWsInput)
    return w_id
}

//get password policy
async function getPasswordPolicy(url, workspaceId){
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {wsPasswordPolicy, error} = await hexabase.workspaces.getPasswordPolicy(workspaceId)
    return wsPasswordPolicy
}

//get functionality
async function getFunctionality(url, workspaceId){
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {wsFunctionality, error} = await hexabase.workspaces.getFunctionality(workspaceId)
    return wsFunctionality
}

//get usage
async function getUsage(url, workspaceId){
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {wsUsage, error} = await hexabase.workspaces.getUsage(workspaceId)
    return wsUsage
}

//get group children
async function getGroupChildren(url, workspaceId){
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {wsGroupChildren, error} = await hexabase.workspaces.getGroupChildren(workspaceId)
    return wsGroupChildren
}

//get task queue list
async function getTaskQueueList(url, workspaceId, queryTaskList){
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {taskQueueList, error} = await hexabase.workspaces.getTaskQueueList(workspaceId, queryTaskList)
    return taskQueueList
}

//get task queue status
async function getTaskQueueStatus(url, taskId, workspaceId){
    const user = JSON.parse(localStorage.getItem('user'))
    const hexabase = await createClient({ url, token: user.token})
    const {taskQueueStatus, error} = await hexabase.workspaces.getTaskQueueStatus(taskId, workspaceId)
    return taskQueueStatus
}
