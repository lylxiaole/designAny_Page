import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export async function uploadFile(file: File): Promise<string> {
  let formdata: FormData = new FormData()
  formdata.append('file', file)
  let url = apiAddr() + 'api/file/UploadFile'
  const resp = await ajaxPost(url, formdata)
  return resp.data
}

export async function uploaBase64dFile(base64Str: string): Promise<string> {
  let url = apiAddr() + 'api/file/UploaBase64dFile'
  const resp = await ajaxPost(url, base64Str)
  return resp.data
}

export async function GetFileBase64(fileId: string): Promise<string> {
  let url = apiAddr() + 'api/file/GetFileBase64?fileId=' + fileId
  const resp = await ajaxPost(url)
  return resp.data
}
