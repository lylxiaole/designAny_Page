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
