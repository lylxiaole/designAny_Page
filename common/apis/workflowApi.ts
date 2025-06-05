import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('workflowApiAddr')

export async function getFuncObjsTree(): Promise<any[]> {
  let url = apiAddr() + 'wkapi/funcNodes/getFuncObjsTree'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function initNewFactory(): Promise<string> {
  let url = apiAddr() + 'wkapi/funcNodes/initNewFactory'
  const resp = await ajaxGet(url)
  return resp.data
}

export async function keepFactory(factoryId: string): Promise<void> {
  let url = apiAddr() + 'wkapi/funcNodes/keepFactory?factoryId=' + factoryId
  const resp = await ajaxGet(url)
  return resp.data
}

export async function excuteFactoryNext(factoryId: string): Promise<void> {
  let url = apiAddr() + 'wkapi/funcNodes/excuteFactoryNext?factoryId=' + factoryId
  const resp = await ajaxGet(url)
  return resp.data
}

export async function excuteFactoryReDo(factoryId: string): Promise<void> {
  let url = apiAddr() + 'wkapi/funcNodes/excuteFactoryReDo?factoryId=' + factoryId
  const resp = await ajaxGet(url)
  return resp.data
}
