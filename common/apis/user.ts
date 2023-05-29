import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

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
export async function login(data) {
  let url = apiAddr() + 'api/user/login'
  const resp = await ajaxPost(url, data)
  return resp.data
}

export async function autoLogin() {
  let url = apiAddr() + 'api/user/autoLogin'
  const resp = await ajaxPost(url)
  return resp.data
}

export async function requestRegisterUser(data: EmailCheckInfo) {
  let url = apiAddr() + 'api/user/requestRegisterUser'
  const resp = await ajaxPost(url, data)
  return resp.data
}
export async function CheckRegisterInfo(data: EmailCheckInfo) {
  let url = apiAddr() + 'api/user/checkRegisterInfo'
  const resp = await ajaxPost(url, data)
  return resp.data
}
export async function requestChangePwd(data: EmailCheckInfo) {
  let url = apiAddr() + 'api/user/requestChangePwd'
  const resp = await ajaxPost(url, data)
  return resp.data
}
export async function CheckChangePwdInfo(data: EmailCheckInfo) {
  let url = apiAddr() + 'api/user/CheckChangePwdInfo'
  const resp = await ajaxPost(url, data)
  return resp.data
}

export async function getUserByUserId(userId: string): Promise<UserInfoDC> {
  let url = apiAddr() + 'api/user/getUserByUserId?userId=' + userId
  const resp = await ajaxGet(url)
  return resp.data
}
export async function getSelfInfo(): Promise<UserInfoDC> {
  let url = apiAddr() + 'api/user/getSelfInfo'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function UpdateSelfInfo(user: UserInfoDC): Promise<boolean> {
  let url = apiAddr() + 'api/user/UpdateSelfInfo'
  const resp = await ajaxPost(url, user)
  return resp.data
}
