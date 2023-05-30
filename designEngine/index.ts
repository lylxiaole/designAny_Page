import * as engine from './03designerLayoutBase'
export * from './03designerLayoutBase'

import MobilePageDesign from './05designerLayouts/PCPageDesign.vue'
import MobilePagePreview from './05designerLayouts/PCPageDesign.vue'
import PCPageDesign from './05designerLayouts/PCPageDesign.vue'
import PCPagePreview from './05designerLayouts/PCPageDesign.vue'
export { MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview }

/**加载所有设计器组件 */
const modulesFiles = require.context('./04designerComponents', true, /\.(vue)$/)
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles<any>(modulePath)
  return modules
}, {})
