export enum formulaType {
  cute = 'cute', //计算
  filter = 'filter' //判断条件
}
import behaviorContext from './01designerContext/context'
export { behaviorContext }
// export * from './04_actionReaourceTree'
export * from './actFuncBase'
export * from './actObject'
export * from './actionFactory'
export * from './behaviorTypes'

import behaviorList from './behaviorDesigner/behaviorList.vue'
export { behaviorList }

const modulesFiles = require.context('./actionResourceFunctions', true, /\.(ts|js)$/)
export function init(apiAddr) {
  behaviorContext.designerServerApiAddr = apiAddr
  modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath)
    return modules
  }, {})
}
