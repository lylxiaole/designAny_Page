import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = getConfigByName('apiAddr')

export enum checkType {
  register = 0,
  changePwd = 1
}
export class EmailCheckInfo {
  public checkId: string
  public username: string
  public pwd: string
  public email: string
  public type: checkType
  public checkingCode: string
  public outerTime: number
}

export class UserInfoDC {
  public id: string
  public modifiedTime: string
  public isDeleted: boolean
  public username: string
  public email: string

  public avatar: string
  public nickname: string
  public region: string
}

/**
 * data:{ username: uname, pwd: pwd, machineId: machineId }
 */
export function login(data) {
  let url = apiAddr + 'api/user/login'
  return ajaxPost(url, data)
}

export function autoLogin() {
  let url = apiAddr + 'api/user/autoLogin'
  return ajaxPost(url)
}

export function requestRegisterUser(data: EmailCheckInfo) {
  let url = apiAddr + 'api/user/requestRegisterUser'
  return ajaxPost(url, data)
}
export function CheckRegisterInfo(data: EmailCheckInfo) {
  let url = apiAddr + 'api/user/checkRegisterInfo'
  return ajaxPost(url, data)
}
export function requestChangePwd(data: EmailCheckInfo) {
  let url = apiAddr + 'api/user/requestChangePwd'
  return ajaxPost(url, data)
}
export function CheckChangePwdInfo(data: EmailCheckInfo) {
  let url = apiAddr + 'api/user/CheckChangePwdInfo'
  return ajaxPost(url, data)
}

export function getUserByUserId(userId: string): Promise<UserInfoDC> {
  let url = apiAddr + 'api/user/getUserByUserId?userId=' + userId
  return ajaxGet(url)
}
export function getSelfInfo(): Promise<UserInfoDC> {
  let url = apiAddr + 'api/user/getSelfInfo'
  return ajaxGet(url)
}

export function UpdateSelfInfo(user: UserInfoDC): Promise<boolean> {
  let url = apiAddr + 'api/user/UpdateSelfInfo'
  return ajaxPost(url, user)
}
