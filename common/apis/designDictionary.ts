// ****************************************
import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export class BaseClass {
  public id: string
  public modifiedTime: string
  public isDeleted: boolean
}

export class DictionaryEntity extends BaseClass {
  public key: string
  public value: string
}

export async function AddOrUpdate(data: DictionaryEntity): Promise<boolean> {
  let url = apiAddr() + `api/designDictionary/AddOrUpdate`
  const resp = await ajaxPost(url, data)
  return resp.data
}

export async function GetAll(): Promise<DictionaryEntity[]> {
  let url = apiAddr() + 'api/designDictionary/GetAll'
  const resp = await ajaxGet(url)
  return resp.data
}
export async function DeleteDictionary(data: DictionaryEntity): Promise<boolean> {
  let url = apiAddr() + 'api/designDictionary/delete'
  const resp = await ajaxPost(url, data)
  return resp.data
}
