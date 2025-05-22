import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('workflowApiAddr')

export async function GetAllApis(type?: number): Promise<any[]> {
  let url = apiAddr() + 'wkapi/funcNodes/getFuncObjsTree'
  const resp = await ajaxGet(url)
  return resp.data
}
