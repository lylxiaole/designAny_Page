export * from './05designerLayouts/DesignEvents'

import PCPageDesign from './05designerLayouts/PCPageDesign.vue'
import PCPagePreview from './06viewLayouts/PCPagePreview.vue'

import TableCellDesign from './05designerLayouts/TableCellDesign.vue'
import TableCellView from './06viewLayouts/TableCellView.vue'

import DialogPageDesign from './05designerLayouts/DialogPageDesign.vue'
import DialogPageView from './06viewLayouts/DialogPageView.vue'

export { PCPageDesign, PCPagePreview, TableCellView, TableCellDesign, DialogPageView, DialogPageDesign }
import applicationContext from './01designerContext/context'
import { GetPageDetail } from '@common/apis/designPage'
export { applicationContext }
import * as utils from '@design-any/interface/dist/utils'

/**加载所有设计器组件 */
const modulesFiles = require.context('./', true, /\.(vue|ts)$/)

export function init(apiAddr, getPageDetail) {
  applicationContext.engineServerApiAddr = apiAddr
  applicationContext.getPageDetailById = async function (pageId) {
    let res = await GetPageDetail(pageId)
    let pageData = null
    if (res.designDetail) {
      let pageDataJson = utils.strUnZip(res.designDetail)
      pageData = utils.deserialize(pageDataJson)
    }
    return pageData
  }
  // ***********************
  modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath)
    return modules
  }, {})
  // **************************
}
