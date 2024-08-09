// ****************************************
import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export class BaseClass {
  public id: string
  public modifiedTime: string
  public isDeleted: boolean
}

export class ThirtyApiDC extends BaseClass {
  public groupId: string
  public name: string
  public desc: string
  public index: number

  public bodyContent: string[]
  public inParams: string[]
  public headers: string[]
}
export class ThirtyAPIGroupDC extends BaseClass {
  public parentGroupId: string
  public groupName: string
  public index: number
  public childrenGroups: ThirtyAPIGroupDC[]
  public childrenAPIs: ThirtyApiDC[]
}

export async function UpdateNodesSort(nodes: any[]): Promise<boolean> {
  let url = apiAddr() + `api/thirtyApi/updateNodesSort`
  const resp = await ajaxPost(url, nodes)
  return resp.data
}

export async function AddApiGroup(dc: ThirtyAPIGroupDC): Promise<ThirtyAPIGroupDC> {
  let url = apiAddr() + 'api/thirtyApi/AddApiGroup'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function DeleteApiGroup(groupId: string): Promise<boolean> {
  let url = apiAddr() + 'api/thirtyApi/DeleteApiGroup'
  const resp = await ajaxPost(url, groupId)
  return resp.data
}
export async function UpdateApiGroup(dc: ThirtyAPIGroupDC): Promise<boolean> {
  let url = apiAddr() + 'api/thirtyApi/UpdateApiGroup'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function GetGroupApisAll(): Promise<ThirtyAPIGroupDC[]> {
  let url = apiAddr() + 'api/thirtyApi/GetGroupApisAll'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function AddOrUpdateAPI(api: ThirtyApiDC): Promise<ThirtyApiDC> {
  let url = apiAddr() + 'api/thirtyApi/AddOrUpdateAPI'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function DeleteAPI(apiId: string): Promise<boolean> {
  let url = apiAddr() + 'api/thirtyApi/DeleteAPI'
  const resp = await ajaxPost(url, apiId)
  return resp.data
}

export async function GetApiDetail(apiId: string): Promise<ThirtyApiDC> {
  let url = apiAddr() + 'api/thirtyApi/GetApiDetail?apiId=' + apiId
  const resp = await ajaxGet(url)
  return resp.data
}
