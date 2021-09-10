import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = getConfigByName('apiAddr')

export function getMachaineById(machineId) {
  let url = apiAddr + 'api/machine/getMachaineById?machineId=' + machineId
  return ajaxGet(url)
}
