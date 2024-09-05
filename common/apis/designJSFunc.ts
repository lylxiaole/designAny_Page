// ****************************************
import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export class BaseClass {
  public id: string
  public modifiedTime: string
  public isDeleted: boolean
}

export class JSFuncEntity extends BaseClass {
  public groupId: string
  public name: string
  public desc: string
  public index: number

  public content: string
}
export class JSFuncGroupDC extends BaseClass {
  public parentGroupId: string
  public groupName: string
  public index: number
  public childrenGroups: JSFuncGroupDC[]
  public childrenFuncs: JSFuncEntity[]
}

export async function UpdateNodesSort(nodes: any[]): Promise<boolean> {
  let url = apiAddr() + `api/jsFunc/updateNodesSort`
  const resp = await ajaxPost(url, nodes)
  return resp.data
}

export async function AddFuncGroup(dc: JSFuncGroupDC): Promise<JSFuncGroupDC> {
  let url = apiAddr() + 'api/jsFunc/AddFuncGroup'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function DeleteFuncGroup(groupId: string): Promise<boolean> {
  let url = apiAddr() + 'api/jsFunc/DeleteFuncGroup'
  const resp = await ajaxPost(url, groupId)
  return resp.data
}
export async function UpdateFuncGroup(dc: JSFuncGroupDC): Promise<boolean> {
  let url = apiAddr() + 'api/jsFunc/UpdateFuncGroup'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function GetGroupFuncsAll(): Promise<JSFuncGroupDC[]> {
  let url = apiAddr() + 'api/jsFunc/GetGroupFuncsAll'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function AddOrUpdateFunc(api: JSFuncEntity): Promise<JSFuncEntity> {
  let url = apiAddr() + 'api/jsFunc/AddOrUpdateFunc'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function AddOrUpdateFunTreeInfo(api: JSFuncEntity): Promise<JSFuncEntity> {
  let url = apiAddr() + 'api/jsFunc/AddOrUpdateFunTreeInfo'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function DeleteAPI(funcId: string): Promise<boolean> {
  let url = apiAddr() + 'api/jsFunc/DeleteAPI'
  const resp = await ajaxPost(url, funcId)
  return resp.data
}

export async function GetFuncDetail(funcId: string): Promise<JSFuncEntity> {
  let url = apiAddr() + 'api/jsFunc/GetFuncDetail?funcId=' + funcId
  const resp = await ajaxGet(url)
  return resp.data
}
