import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')
export enum applicationType {
  dashBoard = 0, //PC看板
  report = 1, //PC报表
  webSystem = 2 //PC网页
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

export function GetApplicationList() {
  let url = apiAddr() + 'api/designApplication/GetApplicationList'
  return ajaxGet(url)
}
export function AddApplication(data: ApplicationDC) {
  let url = apiAddr() + 'api/designApplication/AddApplication'
  return ajaxPost(url, data)
}
export function DeleteApplication(data: ApplicationDC) {
  let url = apiAddr() + 'api/designApplication/DeleteApplication'
  return ajaxGet(url)
}
export function UpdateApplication(data: ApplicationDC) {
  let url = apiAddr() + 'api/designApplication/UpdateApplication'
  return ajaxGet(url)
}
