// ****************************************
import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export class BaseClass {
  public id: string
  public modifiedTime: string
  public isDeleted: boolean
}
export class ApiContentDC extends BaseClass {
  public apiId: string
  public content: string
}
export class DesignedAPIDC extends BaseClass {
  public userId: string
  public apiName: string
  public type: number
  public timerRule: string
  public desc: string
  public enable: boolean
}

export async function GetAllApis(type?: number): Promise<DesignedAPIDC> {
  let url = apiAddr() + 'api/designApi/GetAllApis'
  if (type) {
    url += '?type=' + type
  }
  const resp = await ajaxGet(url)
  return resp.data
}

export async function AddAPI(api: DesignedAPIDC): Promise<DesignedAPIDC> {
  let url = apiAddr() + 'api/designApi/AddAPI'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function DeleteAPI(apiId: string): Promise<boolean> {
  let url = apiAddr() + 'api/designApi/DeleteAPI'
  const resp = await ajaxPost(url, apiId)
  return resp.data
}

export async function UpdateAPI(api: DesignedAPIDC): Promise<boolean> {
  let url = apiAddr() + 'api/designApi/UpdateAPI'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function UpdateSertAPIContent(api: ApiContentDC): Promise<boolean> {
  let url = apiAddr() + 'api/designApi/UpdateSertAPIContent'
  const resp = await ajaxPost(url, api)
  return resp.data
}

export async function GetApiContent(apiId: string): Promise<ApiContentDC> {
  let url = apiAddr() + 'api/designApi/GetApiContent?apiId=' + apiId
  const resp = await ajaxGet(url)
  return resp.data
}

export async function GetApiSimpleInfo(apiId: string): Promise<DesignedAPIDC> {
  let url = apiAddr() + 'api/designApi/GetApiSimpleInfo?apiId=' + apiId
  const resp = await ajaxGet(url)
  return resp.data
}
