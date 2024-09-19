export * from './05designerLayouts/DesignEvents'

import MobilePageDesign from './05designerLayouts/PCPageDesign.vue'
import MobilePagePreview from './06viewLayouts/MobilePagePreview.vue'

import PCPageDesign from './05designerLayouts/PCPageDesign.vue'
import PCPagePreview from './06viewLayouts/PCPagePreview.vue'
export { MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview }
import applicationContext from './01designerContext/context'
export { applicationContext }
/**加载所有设计器组件 */
const modulesFiles = require.context('./', true, /\.(vue|ts)$/)

export function init(apiAddr) {
  applicationContext.designerServerApiAddr = apiAddr
  modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles<any>(modulePath)
    return modules
  }, {})
}
