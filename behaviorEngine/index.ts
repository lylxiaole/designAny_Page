import behaviorContext from './01designerContext/context'
export { behaviorContext }

//加载所有action 方法
const actFuncModulesFiles = require.context('./actionResourceFunctions', true, /\.(ts|js)$/)
//加载所有流程节点
const flowNodeModulesFiles = require.context('./flowDesigner/flowNode_Inner', true, /\.(vue)$/)

export async function init(apiAddr, getAllDictionary, getAllThirtyApis, getGroupFuncsAll) {
  behaviorContext.designerServerApiAddr = apiAddr

  try {
    behaviorContext.getAllDictionary = getAllDictionary
    behaviorContext.getAllThirtyApis = getAllThirtyApis
    behaviorContext.getAllJSFuncs = getGroupFuncsAll
    behaviorContext.allDictionary = await getAllDictionary()
    behaviorContext.allThirtyApis = await getAllThirtyApis()

    behaviorContext.allJSFuncs = await getGroupFuncsAll()
  } catch (error) {}

  actFuncModulesFiles.keys().reduce((modules, modulePath) => {
    const value = actFuncModulesFiles(modulePath)
    return modules
  }, {})

  flowNodeModulesFiles.keys().reduce((modules, modulePath) => {
    const value = flowNodeModulesFiles(modulePath)
    return modules
  }, {})
}
