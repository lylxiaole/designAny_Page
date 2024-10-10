import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')
export enum applicationType {
  dashBoard = 0, //PC看板
  report = 1, //PC报表
  webSystem = 2, //PC网页
  H5App = 3
}
export class ApplicationDC {
  public type: applicationType
  public name: string
  public startTime: string
  public endTime: string
  public id: string
  public modifiedTime: string
  public isDeleted: boolean
}

export async function GetApplicationList() {
  let url = apiAddr() + 'api/designApplication/GetApplicationList'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function GetApplication(appId: string) {
  let url = apiAddr() + 'api/designApplication/GetApplication?appId=' + appId
  const resp = await ajaxGet(url)
  return resp.data
}

export async function AddApplication(data: ApplicationDC) {
  let url = apiAddr() + 'api/designApplication/AddApplication'
  const resp = await ajaxPost(url, data)
  return resp.data
}
export async function DeleteApplication(data: ApplicationDC) {
  let url = apiAddr() + 'api/designApplication/DeleteApplication'
  const resp = await ajaxPost(url, data)
  return resp.data
}
export async function UpdateApplication(data: ApplicationDC) {
  let url = apiAddr() + 'api/designApplication/UpdateApplication'
  const resp = await ajaxPost(url, data)
  return resp.data
}
