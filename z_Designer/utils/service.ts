import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'

const apiAddr = () => getConfigByName('apiAddr')
/**
 * 工艺类型.
 */
export async function GetInOutput(data: any): Promise<any> {
  let url = `${apiAddr()}/ReportManageController/GetInOutput`

  const resp = await ajaxPost(url, data)
  if (resp.result === true) {
    return resp.rtnData
  } else {
    throw new Error(resp.rtnMessage)
  }
}

export async function Getproduction(): Promise<any[]> {
  let url = `${apiAddr()}/ReportManageController/Getproduction`

  const resp = await ajaxPost(url)
  if (resp.result === true) {
    return resp.rtnData
  } else {
    throw new Error(resp.rtnMessage)
  }
}

export async function GetMateiralConsume(data: any): Promise<any> {
  let url = `${apiAddr()}/ReportManageController/GetMateiralConsume`
  const resp = await ajaxPost(url, data)
  if (resp.result === true) {
    return resp.rtnData
  } else {
    throw new Error(resp.rtnMessage)
  }
}

export async function GetMateiralConsumeDetaial(data: any): Promise<any> {
  let url = `${apiAddr()}/ReportManageController/GetMateiralConsumeDetaial`
  const resp = await ajaxPost(url, data)
  if (resp.result === true) {
    return resp.rtnData
  } else {
    throw new Error(resp.rtnMessage)
  }
}

export async function UpdateMateiralConsume(data: any): Promise<any> {
  let url = `${apiAddr()}/ReportManageController/UpdateMateiralConsume`
  const resp = await ajaxPost(url, data)
  if (resp.result === true) {
    return resp.rtnData
  } else {
    throw new Error(resp.rtnMessage)
  }
}
