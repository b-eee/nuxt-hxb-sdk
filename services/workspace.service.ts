import { QueryTaskList } from "@hexabase/hexabase-js/src/lib/types/workspace/input";
import { createClient, HexabaseClient } from "@hexabase/hexabase-js";
import { useRuntimeConfig } from "#imports";
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

async function initHxbClient() {
  const token = JSON.parse(localStorage.getItem("user")!).token;
  const hexabase =
    token &&
    (await createClient({ url: useRuntimeConfig().public.baseUrl, token }));
  return hexabase;
}

// get all workspaces
async function getWorkspaces() {
  const hexabase: HexabaseClient = await initHxbClient();
  const { workspaces, error } = await hexabase.workspace.get();
  return workspaces;
}

// set workspace current id
async function setWorkspace(id: string) {
  const setCurrentWsPl = {
    workspace_id: id,
  };
  const hexabase = await initHxbClient();
  const { data, error } = await hexabase.workspace.setCurrent(setCurrentWsPl);
  return data;
}

//create a workspace
async function createWorkspace(name: string) {
  const createWsInput = {
    name,
  };
  const hexabase = await initHxbClient();
  const { w_id, error } = await hexabase.workspace.create(createWsInput);
  return w_id;
}

//get password policy
async function getPasswordPolicy(workspaceId: string) {
  const hexabase = await initHxbClient();
  const { wsPasswordPolicy, error } =
    await hexabase.workspace.getPasswordPolicy(workspaceId);
  return wsPasswordPolicy;
}

//get functionality
async function getFunctionality(workspaceId: string) {
  const hexabase = await initHxbClient();
  const { wsFunctionality, error } = await hexabase.workspace.getFunctionality(
    workspaceId
  );
  return wsFunctionality;
}

//get usage
async function getUsage(workspaceId: string) {
  const hexabase = await initHxbClient();
  const { wsUsage, error } = await hexabase.workspace.getUsage(workspaceId);
  return wsUsage;
}

//get group children
async function getGroupChildren(workspaceId: string) {
  const hexabase = await initHxbClient();
  const { wsGroupChildren, error } = await hexabase.workspace.getGroupChildren(
    workspaceId
  );
  return wsGroupChildren;
}

//get task queue list
async function getTaskQueueList(
  workspaceId: string,
  queryTaskList: QueryTaskList
) {
  const hexabase = await initHxbClient();
  const { taskQueueList, error } = await hexabase.workspace.getTaskQueueList(
    workspaceId,
    queryTaskList
  );
  return taskQueueList;
}

//get task queue status
async function getTaskQueueStatus(taskId: string, workspaceId: string) {
  const hexabase = await initHxbClient();
  const { taskQueueStatus, error } =
    await hexabase.workspace.getTaskQueueStatus(taskId, workspaceId);
  return taskQueueStatus;
}
