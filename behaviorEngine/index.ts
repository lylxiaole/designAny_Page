import behaviorContext from './01designerContext/context'
export { behaviorContext }

import behaviorList from './behaviorDesigner/behaviorList.vue'
export { behaviorList }
//加载所有action 方法
const actFuncModulesFiles = require.context('./actionResourceFunctions', true, /\.(ts|js)$/)
//加载所有流程节点
const flowNodeModulesFiles = require.context('./flowDesigner/flowNode_Inner', true, /\.(vue)$/)

export async function init(apiAddr, getAllDictionary, getAllThirtyApis) {
  behaviorContext.designerServerApiAddr = apiAddr
  behaviorContext.allDictionary = await getAllDictionary()
  behaviorContext.allThirtyApis = await getAllThirtyApis()

  actFuncModulesFiles.keys().reduce((modules, modulePath) => {
    const value = actFuncModulesFiles(modulePath)
    return modules
  }, {})

  flowNodeModulesFiles.keys().reduce((modules, modulePath) => {
    const value = flowNodeModulesFiles(modulePath)
    return modules
  }, {})
}
