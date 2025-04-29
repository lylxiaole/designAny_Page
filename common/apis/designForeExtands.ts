import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
import dataContactBase from './dataContactBase'
const apiAddr = () => getConfigByName('apiAddr')

export class ExtandFile {
  id: string
  name: string
  fileRelativePath: string
  type: string
}

export async function addExtandFile(data: ExtandFile): Promise<string> {
  let url = apiAddr() + `api/foreExtands/addExtandFile`
  const resp = await ajaxPost(url, data)
  return resp.data
}

export async function getAllExtandFiles(): Promise<ExtandFile[]> {
  let url = apiAddr() + `api/foreExtands/getAllExtandFiles`
  const resp = await ajaxGet(url)
  return resp.data
}

export async function deleteExtandFile(id: string): Promise<boolean> {
  let url = apiAddr() + `api/foreExtands/deleteExtandFile`
  const resp = await ajaxPost(url, id)
  return resp.data
}
