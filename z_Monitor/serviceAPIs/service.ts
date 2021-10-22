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
export async function getAlarmHistory(flowmeterId: string, startTime: any, endtime: any): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getJlbLsBjxx')
  formData.append('jlbid', flowmeterId)
  if (startTime) {
    formData.append('kssj', startTime)
  }
  if (endtime) {
    formData.append('jssj', endtime)
  }
  let url = `${apiAddr()}/jlbjk/jlbjk.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
/**流量计参数 监控类型列表 */
export async function getParamsTypeList(): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getSysDic')
  formData.append('pdicCode', 'TAGJKLX')
  let url = `${apiAddr()}/zdcx.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
/**获取流量计参数列表
 * flowmeterId:流量计ID
 *watchType:监控类型
 */
export async function getFlowmeterParams(flowmeterId: string, watchType: string): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getJlbTag')
  formData.append('jlbid', flowmeterId)
  if (watchType) {
    formData.append('jklx', watchType)
  }

  let url = `${apiAddr()}/jlbjk/jlbzdcx.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
/**一个计量表，多参数对比结果 */
export async function getParamsCompareData(flowmeterId: string, paramCodes: string[], startTime: any, endTime: any): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getManyTagRealDataQsHisNew')
  formData.append('jlbid', flowmeterId)
  formData.append('tags', "'" + paramCodes.join("','") + "'")
  formData.append('cxksrq', startTime)
  formData.append('cxjsrq', endTime)

  let url = `${apiAddr()}/jlbjk/jlbjk.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
/**两个计量表，单参数对比结果 */
export async function getFlowmeterCompareData(flowmeter1Id: string, flowmeter2Id: string, paramCodes1: any[], paramCodes2: any[], startTime: any, endTime: any): Promise<any> {
  var formData = new FormData()
  formData.append('action', 'getManyTagRealDataQsHisNewDouble')
  formData.append('jlbid', flowmeter1Id)
  formData.append('jlbid1', flowmeter2Id)
  formData.append('tags1', "'" + paramCodes1.join("','") + "'")
  formData.append('tags2', "'" + paramCodes2.join("','") + "'")
  formData.append('cxksrq', startTime)
  formData.append('cxjsrq', endTime)

  let url = `${apiAddr()}/jlbjk/jlbjk.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
/**报警处理
 * bjids:报警Id集合
 * clr:处理人
 * bz:处理备注
 */
export async function dealAlarmMethod(bjids: string[], clr: string, bz: string) {
  var formData = new FormData()
  formData.append('action', 'handlingAlarms')
  formData.append('ids', "'" + bjids.join("','") + "'")
  formData.append('wcr', clr)
  formData.append('bz', bz)
  let url = `${apiAddr()}/jlbjk/jlbzdcx.ashx`
  const resp = await ajaxPost(url, formData)
  return resp
}
