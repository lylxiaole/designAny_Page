import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export async function uploadFile(file): Promise<string> {
  let url = apiAddr() + 'api/File/UploadFile'
  const resp = await ajaxPost(url, file)
  return resp.data
}

export async function uploaBase64dFile(base64Str: string): Promise<string> {
  let url = apiAddr() + 'api/File/UploaBase64dFile'
  const resp = await ajaxPost(url, base64Str)
  return resp.data
}

export async function GetFileBase64(fileId: string): Promise<string> {
  let url = apiAddr() + 'api/File/GetFileBase64?fileId=' + fileId
  const resp = await ajaxPost(url)
  return resp.data
}
