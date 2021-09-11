import { ajaxGet, ajaxPost } from '@src/utils/axiosEnhancer'
import { getConfigByName } from '@src/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')
export function getApplicationList() {
  let url = apiAddr() + 'api/designApplication/GetApplicationList'
  return ajaxGet(url)
}
