import * as engine from './03designerLayoutBase'
export * from './03designerLayoutBase'

import MobilePageDesign from './05designerLayouts/PCPageDesign.vue'
import MobilePagePreview from './05designerLayouts/PCPageDesign.vue'
import PCPageDesign from './05designerLayouts/PCPageDesign.vue'
import PCPagePreview from './05designerLayouts/PCPageDesign.vue'
export { MobilePageDesign, MobilePagePreview, PCPageDesign, PCPagePreview }

/**动态读取设计器组件 */
const modulesFiles = require.context('./04designerComponents', true, /\.(vue)$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // const value = modulesFiles<any>(modulePath)
  // if (value.default.prototype.$Meta && value.default.prototype.$Meta.compCode) {
  //   let compCode = value.default.prototype.$Meta.compCode
  //   // window.console.log('require.context', compCode, engine.CompIndex.indexs[compCode])
  //   if (!engine.CompIndex.indexs[compCode]) {
  //     engine.CompIndex.indexs[compCode] = value.default
  //     let metadata = value.default.prototype.$Meta
  //     let layoutInfo = new engine.LayoutInfo(metadata.layoutType, metadata.groupName, metadata.name, value.default, metadata.icon, metadata.compCode)
  //     engine.allComponents.push(layoutInfo)
  //   }
  // } 
  return modules
}, {})
