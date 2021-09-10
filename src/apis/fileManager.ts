import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export function uploadFile(file): Promise<string> {
  let url = apiAddr() + 'api/File/UploadFile'
  return ajaxPost(url, file)
}

export function uploaBase64dFile(base64Str: string): Promise<string> {
  let url = apiAddr() + 'api/File/UploaBase64dFile'
  return ajaxPost(url, base64Str)
}

export async function GetFileBase64(fileId: string): Promise<string> {
  let url = apiAddr() + 'api/File/GetFileBase64?fileId=' + fileId
  return ajaxPost(url)
}
