import { useRuntimeConfig } from "#app";
import { createClient } from "@hexabase/hexabase-js";
import { ItemFileAttachmentPl } from "@hexabase/hexabase-js/dist/lib/types/storage";

export const storageService = {
  getFile,
  createFile,
  deleteFile,
};

async function initHxbClient() {
  const token = JSON.parse(localStorage.getItem("user")!).token;
  const hexabase =
    token &&
    (await createClient({ url: useRuntimeConfig().public.baseUrl, token }));
  return hexabase;
}

async function getFile(getDownloadFileId: string) {
  const hexabase = await initHxbClient();
  const { file, error } = await hexabase.storage?.getFile(getDownloadFileId);
  return file;
}

async function createFile(payload: ItemFileAttachmentPl) {
  const hexabase = await initHxbClient();
  const { data, error } = await hexabase.storage.createFile(payload);
  return data;
}

async function deleteFile(fileId: string) {
  const hexabase = await initHxbClient();
  const { data, error } = await hexabase.storage.delete({ fileId });
  return data;
}
