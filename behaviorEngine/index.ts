import behaviorContext from './01designerContext/context'
export { behaviorContext }
// export * from './04_actionReaourceTree'
export * from './actFuncBase'
export * from './actObject'
export * from './actionFactory_oldback'
export * from './actResource'
export * from './behaviorTypes'

import behaviorList from './behaviorDesigner/behaviorList.vue'
export { behaviorList }
//加载所有action 方法
const actFuncModulesFiles = require.context('./actionResourceFunctions', true, /\.(ts|js)$/)

//加载所有流程节点
const flowNodeModulesFiles = require.context('./flowNode_Inner', true, /\.(vue)$/)

export function init(apiAddr) {
  behaviorContext.designerServerApiAddr = apiAddr
  actFuncModulesFiles.keys().reduce((modules, modulePath) => {
    const value = actFuncModulesFiles(modulePath)
    return modules
  }, {})

  flowNodeModulesFiles.keys().reduce((modules, modulePath) => {
    const value = flowNodeModulesFiles(modulePath)
    return modules
  }, {})
}
