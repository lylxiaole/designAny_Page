import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export async function getFuncObjsTree(): Promise<any[]> {
  let url = apiAddr() + 'api/behaviorFactory/getFuncObjsTree'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function initNewFactory(apiId: string): Promise<string> {
  let url = apiAddr() + 'api/behaviorFactory/initNewFactory?apiId=' + apiId
  const resp = await ajaxGet(url)
  return resp.data
}

export async function keepFactory(factoryId: string): Promise<void> {
  let url = apiAddr() + 'api/behaviorFactory/keepFactory?factoryId=' + factoryId
  const resp = await ajaxGet(url)
  return resp.data
}

export async function excuteFactoryNext(factoryId: string): Promise<any[]> {
  let url = apiAddr() + 'api/behaviorFactory/excuteFactoryNext?factoryId=' + factoryId
  const resp = await ajaxGet(url)
  return resp.data
}

export async function excuteFactoryReDo(factoryId: string): Promise<void> {
  let url = apiAddr() + 'api/behaviorFactory/excuteFactoryReDo?factoryId=' + factoryId
  const resp = await ajaxGet(url)
  return resp.data
}
