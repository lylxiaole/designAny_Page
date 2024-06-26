// ****************************************
import { ajaxGet, ajaxPost } from 'common/utils/axiosEnhancer'
import { getConfigByName } from 'common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export class BaseClass {
  public Id: string
  public ModifiedTime: string
  public IsDeleted: boolean
}
export class ApiContentDC extends BaseClass {
  public ApiId: string
  public Content: string
}
export class DesignedAPIDC extends BaseClass {
  public GroupId: string
  public APIName: string
  public Desc: string
}
export class DesignedAPIGroupDC extends BaseClass {
  public ParentGroupId: string
  public GroupName: string
  public ChildrenGroups: DesignedAPIGroupDC[]
  public ChildrenAPIs: DesignedAPIDC[]
}

export async function AddApiGroup(dc: DesignedAPIGroupDC): Promise<boolean> {
  let url = apiAddr() + 'api/LYLDesigner/AddApiGroup'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function DeleteApiGroup(groupId: string): Promise<boolean> {
  let url = apiAddr() + 'api/LYLDesigner/DeleteApiGroup'
  const resp = await ajaxPost(url, groupId)
  return resp.data
}
export async function UpdateApiGroup(dc: DesignedAPIGroupDC): Promise<boolean> {
  let url = apiAddr() + 'api/LYLDesigner/UpdateApiGroup'
  const resp = await ajaxPost(url, dc)
  return resp.data
}
export async function GetGroupApisAll(): Promise<DesignedAPIGroupDC[]> {
  let url = apiAddr() + 'api/LYLDesigner/GetGroupApisAll'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function AddAPI(api: DesignedAPIDC): Promise<boolean> {
  let url = apiAddr() + 'api/LYLDesigner/AddAPI'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function DeleteAPI(apiId: string): Promise<boolean> {
  let url = apiAddr() + 'api/LYLDesigner/DeleteAPI'
  const resp = await ajaxPost(url, apiId)
  return resp.data
}

export async function UpdateAPI(api: DesignedAPIDC): Promise<boolean> {
  let url = apiAddr() + 'api/LYLDesigner/UpdateAPI'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function UpdateSertAPIContent(api: ApiContentDC): Promise<boolean> {
  let url = apiAddr() + 'api/LYLDesigner/UpdateSertAPIContent'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function GetApiSimpleInfo(apiId: string): Promise<DesignedAPIDC> {
  let url = apiAddr() + 'api/LYLDesigner/GetApiSimpleInfo?apiId=' + apiId
  const resp = await ajaxGet(url)
  return resp.data
}
