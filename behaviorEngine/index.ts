import factory from './03_actionFactory'
export { factory }
export * from './03_actionFactory'

export * from './behaviorTypes'

export enum formulaType {
  cute = 'cute', //计算
  filter = 'filter' //判断条件
}

const modulesFiles = require.context('./actionResourceFunctions', true, /\.(ts|js)$/)
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  return modules
}, {})

// export * from './04_actionReaourceTree'
export * from './actFuncBase'
export * from './actObject'
