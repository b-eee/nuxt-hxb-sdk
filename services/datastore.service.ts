import { useRuntimeConfig } from "#app";
import { createClient } from "@hexabase/hexabase-js";

export const datastoreService = {
  getFields,
  getField,
  getActions,
  getDetail,
  getStatuses
};

async function initHxbClient() {
  const token = JSON.parse(localStorage.getItem("user")!).token;
  const hexabase =
    token &&
    (await createClient({ url: useRuntimeConfig().public.baseUrl, token }));
  return hexabase;
}

async function getFields(datastoreId: string, projectId: string) {
  const hexabase = await initHxbClient();
  const { dsFields, error } = await hexabase.datastores.getFields(
    datastoreId,
    projectId
  );
  return dsFields;
}

async function getDetail(datastoreId: string) {
  const hexabase = await initHxbClient();
  const { datastoreSetting, error } = await hexabase.datastores.getDetail(
    datastoreId
  );
  return datastoreSetting;
}

async function getField(fieldId: string, datastoreId: string) {
  const hexabase = await initHxbClient();
  const { dsField, error } = await hexabase.datastores.getField(
    fieldId,
    datastoreId
  );
  return dsField;
}
async function getStatuses(datastoreId: string) {
  const hexabase = await initHxbClient();
  const { dsStatuses, error } = await hexabase.datastores.getStatuses(
    datastoreId
  );
  return dsStatuses;
}

async function getActions(datastoreId: string) {
  const hexabase = await initHxbClient();
  const { dsActions, error } = await hexabase.datastores.getActions(
    datastoreId
  );
  return dsActions;
}
