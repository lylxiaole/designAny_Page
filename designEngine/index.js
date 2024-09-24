export * from './05designerLayouts/DesignEvents'

import MobilePageDesign from './05designerLayouts/PCPageDesign.vue'
import MobilePagePreview from './06viewLayouts/MobilePagePreview.vue'

import PCPageDesign from './05designerLayouts/PCPageDesign.vue'
import PCPagePreview from './06viewLayouts/PCPagePreview.vue'
export { MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview }
import applicationContext from './01designerContext/context'
import { GetPageDetail } from '@common/apis/designPage'
export { applicationContext }
import * as utils from '@design-any/interface/dist/utils'

import '@design-any/basiccomps/designany.basiccomps.min.js'
import '@design-any/basiccomps/index.css'

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
