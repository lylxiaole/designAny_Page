import { EnginePage, EngineLayout } from '../LayoutInterface'
import {} from '../LayoutInterface'

import { behavior, param } from './behavior'
import { actionObj, object_InParam, object_group } from './actObject'
import { getUuid } from '../utils'
//方法资源分组
export enum funcGroup {
  universalTool = '通用工具',
  storages = '缓存',
  pageOption = '页面资源'
}
//方法编码-需要保证唯一性
export enum funcCode {
  propertiesInPage = 'propertiesInPage',
  methodsInPage = 'methodsInPage',

  dictionary = 'dictionary', //字典
  thirtyApi = 'thirtyApi', //外部API

  oneParamJude = 'oneParamJude', //单条件判断
  notificationDialog = 'notificationDialog', //提示窗
  fixedVal = 'fixedVal',
  leadToOtherPage = 'leadToOtherPage',
  windowLocalStorage = 'windowLocalStorage'
}
//方法作用范围
export enum funcStack {
  webpc = 'webpc',
  webapp = 'webapp',
  server = 'server',
  universal = 'universal'
}
//反射，所有方法的实体类
var allActFunctions = []
export function resourceFuncAttr(name: string, desc: string, funcGroup?: funcGroup, funcCode?: funcCode, funcStack?: funcStack, inparams?: param[], outParam?: param, isJudeNode?: boolean) {
  return function(target: Function) {
    !target.prototype.$lyl_actFunc && (target.prototype.$lyl_actFunc = {})
    target.prototype.$lyl_actFunc.funcCode = funcCode
    target.prototype.$lyl_actFunc.funcStack = funcStack
    target.prototype.$lyl_actFunc.funcGroup = funcGroup
    target.prototype.$lyl_actFunc.inparams = inparams
    target.prototype.$lyl_actFunc.outParam = outParam
    target.prototype.$lyl_actFunc.name = name
    target.prototype.$lyl_actFunc.isJudeNode = isJudeNode
    target.prototype.$lyl_actFunc.desc = desc
    allActFunctions.push(target)
  }
}
export { allActFunctions }

//方法的父类型
export interface actFuncBase {
  currentActObj: actionObj
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior

  excute: (inparams: object_InParam[]) => Promise<any>
}

//actFunc转actObj
export function funcToObj(actFunc: any): actionObj {
  var obj = new actionObj()
  obj.id = getUuid()
  obj.name = actFunc.prototype.$lyl_actFunc.name
  obj.funcCode = actFunc.prototype.$lyl_actFunc.funcCode
  obj.description = actFunc.prototype.$lyl_actFunc.desc
  obj.inputParams = actFunc.prototype.$lyl_actFunc.inparams
  obj.outParam = actFunc.prototype.$lyl_actFunc.outParam
  obj.isJudeNode = actFunc.prototype.$lyl_actFunc.isJudeNode
  obj.resourceFilter = {}
  return obj
}
//根据方法的信息，把方法的元数据组织成树结构，提供给设计器使用
export function getFuncObjsTree() {
  let res = [] //object_group
  for (let index = 0; index < allActFunctions.length; index++) {
    const actFunc = allActFunctions[index]
    let group = actFunc.prototype.$lyl_actFunc.funcGroup
    let findGroup = res.find((o) => o.title === group)
    if (!findGroup) {
      findGroup = new object_group()
      findGroup.key = getUuid()
      findGroup.title = group
      findGroup.childrenGroups = []
      findGroup.childrenObjs = []
      res.push(findGroup)
    }

    let actObj = funcToObj(actFunc)
    findGroup.childrenObjs.push(actObj)
  }
  return res
}
//获取指定类型的方法元数据
export function getFuncObjByGroup(group: funcGroup) {
  let funcs = allActFunctions.filter((o: any) => o.prototype.$lyl_actFunc.funcGroup == group)
  let objs = []
  for (let index = 0; index < funcs.length; index++) {
    const element = funcs[index]
    objs.push(funcToObj(element))
  }
  return objs
}

export function getFuncByType(funcCode: funcCode) {
  // window.console.log('行为代码2', funcCode)
  var res = allActFunctions.find((o: any) => o.prototype.$lyl_actFunc.funcCode == funcCode)
  try {
    return new res()
  } catch (error) {
    return null
  }
}
export function getFuncObjByType(funcCode: funcCode): actionObj {
  // window.console.log('行为代码2', funcCode)
  var res = allActFunctions.find((o: any) => o.prototype.$lyl_actFunc.funcCode == funcCode)
  try {
    return funcToObj(res)
  } catch (error) {
    return null
  }
}
