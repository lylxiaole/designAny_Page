import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'

const apiAddr = () => getConfigByName('apiAddr')
/**
 * 计量表状态统计.
 * {
    "action":"getJlbzthz"
   }
 */
export async function jlbjk(data: any): Promise<any> {
  let url = `${apiAddr()}/jlbjk/jlbjk.ashx`
  const resp = await ajaxPost(url, data)
  return resp
}

/**
 * 设备维保信息查询（当天的一条和当天的统计）
 * 设备巡检信息查询（当天的一条和当天的统计）
 * 物理区域查询
 * 采集站状态
 * 报警信息查询（最近3条）
 * 流量计数据模糊查询（如果数据过多，接口需要分页）
 * 计量表状态查询
 *
 *
 */
export async function jkzl(data: any): Promise<any> {
  let url = `${apiAddr()}/jkzl/jkzl.ashx`
  const resp = await ajaxPost(url, data)
  return resp
}
/**获取所有物理区域 */
export async function jlbzdcx(): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getQy')
  let url = `${apiAddr()}/jlbjk/jlbzdcx.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
/**获取物理区域中所有流量计的概要信息 */
export async function getFlowmetersInArea(areaCode: string): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getQyZtJlb')
  if (areaCode) {
    formData.append('qy', areaCode)
  }

  let url = `${apiAddr()}/jlbjk/jlbzdcx.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
/**流量计状态列表 */
export async function zdcx(): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getSysDic')
  formData.append('pdicCode', 'JLBBJZT')
  let url = `${apiAddr()}/zdcx.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function wbjh(wbjhsj: string, wbzt: string): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'GetDataAll')
  formData.append('wbjhsj', wbjhsj)
  formData.append(wbzt, wbzt)
  let url = `${apiAddr()}/sbtz/wbjh.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function xjjh(xjjhsj: string, xjzt: string): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getXJJHAll')
  formData.append('xjjhsj', xjjhsj)
  formData.append('xjzt', xjzt)
  let url = `${apiAddr()}/sbtz/xjjh.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function getMapMarkerList(): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getQyPzJlbZtHz')
  let url = `${apiAddr()}/jlbjk/jlbjk.ashx?time=${new Date()}`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function getErrorFlowmeters(): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getAllJlb')
  formData.append('gzlx', '2')

  let url = `${apiAddr()}/jlbjk/jlbjk.ashx?time=${new Date()}`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function getCurrentAlarm(flowmeterId): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getJlbBjxx')
  formData.append('jlbid', flowmeterId)
  let url = `${apiAddr()}/jlbjk/jlbjk.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function getFlowmeterDetail(code: string): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getJlbOneInfo')
  formData.append('jlbid', code)
  let url = `${apiAddr()}/jkzl/jkzl.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function getAlarmTop5(flowmeterId): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getWranTop5')
  formData.append('jlbid', flowmeterId)
  let url = `${apiAddr()}/jkzl/jkzl.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
export async function getAlarmHistory(flowmeterId): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getJlbLsBjxx')
  formData.append('jlbid', flowmeterId)
  let url = `${apiAddr()}/jlbjk/jlbjk.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
