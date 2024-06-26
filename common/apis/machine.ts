import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')

export async function getMachaineById(machineId) {
  let url = apiAddr() + 'api/machine/getMachaineById?machineId=' + machineId
  const resp = await ajaxGet(url)
  return resp.data
}
