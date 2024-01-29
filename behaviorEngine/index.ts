import factory from './03_actionFactory'
export { factory }
export * from './03_actionFactory'

export * from './behaviorTypes'
export * as actionFunc from './02_actionResourceFunc'
export enum formulaType {
  cute = 'cute', //计算
  filter = 'filter' //判断条件
}

export * from './04_actionReaourceTree'
export * from './01_actionCommon'

const modulesFiles = require.context('./actionResourceFunctions', true, /\.(vue)$/)
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  return modules
}, {})

export * from './actResFuncBase'
