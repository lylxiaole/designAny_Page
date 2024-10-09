// *********************************************************
const modulesFiles = require.context('./', true, /\.(vue)$/)
import { getUuid } from '@design-any/interface/dist/utils/index'
// *******************************************
// const install = (Vue) => {
//   // *********************************************************
//   const ElementPlus = require('element-plus')
//   require('element-plus/dist/index.css')
//   const ElementPlusIconsVue = require('@element-plus/icons-vue')
//   // *********************************************************
//   const VXETable = require('vxe-table')
//   require('vxe-table/lib/style.css')
//   // *********************************************************
//   Vue.use(ElementPlus)
//   Vue.use(VXETable)
//   for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     Vue.component(key, component)
//   }

//   modulesFiles.keys().reduce((modules, modulePath) => {
//     const value = modulesFiles(modulePath)
//     Vue.component(getUuid(), value.default)
//     return modules
//   }, {})
// }
// export default install
// *************************************************************************************
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  // Vue.component(getUuid(), value.default)
  return modules
}, {})
// *************************************************************************************
