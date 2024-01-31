import Vue from 'vue'
import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { Property } from '@designEngine/index'
import { behavior } from './behaviorTypes'

import { object_group, objectBase } from './actObject'

import { objectType, object_FixedVal, object_Method, object_callback, popupCallback, object_Signs, object_Variable } from './actObject'
//方法资源分组
export enum resourceGroup {
  fixedVal = 'fixedVal',
  cuteSigns = 'cuteSigns',
  filterSigns = 'filterSigns'
}
//方法类型
export enum resourceType {
  fixedValBool = 'fixedValBool',
  fixedValString = 'fixedValBool',
  fixedValFloat = 'fixedValFloat',
  fixedValNone = 'fixedValNone',
  fixedValInt = 'fixedValInt',
  signAdd = 'signAdd', //加
  signReduce = 'signReduce', //减
  signAssign = 'signAssign', //赋值
  signMultiply = 'signReduce', //乘
  signDivide = 'signReduce', //除
  signEqual = 'signEqual', //相等于
  signNotEqual = 'signNotEqual', //不等于
  signGreaterThan = 'signGreaterThan', //大于
  signLessThan = 'signLessThan', //小于
  signGTOQ = 'signGTOQ', //大于等于
  signLTOQ = 'signLTOQ', //小于等于
  signAnd = 'signAnd', //且
  signOr = 'signOr', //或

  propertiesInPage = 'propertiesInPage',
  methodsInPage = 'methodsInPage',
  behaviorInParam = 'behaviorInParam',
  pageInParams = 'pageInParams',
  pageContext = 'pageContext',
  workflows = 'workflows',
  workflowsAsync = 'workflowsAsync',
  systemDict = 'systemDict', //系统枚举
  fileTemplate = 'fileTemplate', //文件模板
  localStorage = 'localStorage', //本地资源
  customFunctions = 'customFunctions',
  controlMethods = 'controlMethods',
  controlProperties = 'controlProperties',
  variables = 'variables',
  signs = 'signs',
  filterSigns = 'filterSigns',
  models = 'models',
  modelsStructure = 'modelsStructure',
  behaviors = 'behaviors',
  modelsProperty = 'modelsProperty',
  modelsFilter = 'modelsFilter',
  modelsPropRule = 'modelsPropRule',
  normalPopupWindow = 'normalPopupWindow',
  confirmPopup = 'confirmPopup',
  pagePopupWindow = 'pagePopupWindow',
  pageRoute = 'pageRoute',
  callback = 'callback',
  modelMapper = 'modelMapper',
  consoleSettings = 'consoleSettings',
  externalLinks = 'externalLinks',
  uploadFile = 'uploadFile', //上传excel文件,以供解析
  uploadFile_all = 'uploadFile_all', //可自由定义类型的文件上传
  serverTimeNow = 'serverTimeNow',
  downloadFile = 'downloadFile',
  breakBehavior = 'breakBehavior',
  breakBehaviorAll = 'breakBehaviorAll',
  controlLoadingWindow = 'controlLoadingWindow',
  callLocalProgram = 'callLocalProgram',
  designReportTemplate = 'designReportTemplate', //设计模板
  reportPrintPreview = 'reportPrintPreview', //打印预览
  reportPrint = 'reportPrint', //打印
  openLocalExeToOpenFile = 'openLocalExeToOpenFile',
  deleteReport = 'deleteReport',
  pageSources = 'pageSources'
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
export function resourceFuncAttr(name: string, desc: string, resGroup?: resourceGroup, resType?: resourceType, funcStack?: funcStack) {
  return function (target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    target.prototype.$Meta.resType = resType
    target.prototype.$Meta.funcStack = funcStack
    target.prototype.$Meta.resGroup = resGroup
    target.prototype.$Meta.name = name
    target.prototype.$Meta.desc = desc
    allActFunctions.push(target)
  }
}
export { allActFunctions }

//方法的父类型
export interface actFuncBase<T> {
  $meta: T //动作的元数据，用于保存。描述了动作的类型，出入参数等关键信息
  currentLayout: EngineLayout
  currentPage: EnginePage
  currentBehavior: behavior

  getFunc(obj: objectBase): any
  setFunc(obj: objectBase, val: any): void
  /**获取组件的描述 */
  getDesc(obj: objectBase): string
  /**是否存在 */
  isExit(obj: objectBase): boolean
  /**获取公式的完善信息，包括它的入参/返回的数据结构等等 */
  getSettingDetail(obj: objectBase): objectBase
}

//根据方法的信息，把方法的元数据组织成树结构，提供给设计器使用
export function getFuncObjsTree() {
  let res = [] //object_group

  for (let index = 0; index < allActFunctions.length; index++) {
    const actFunc = allActFunctions[index]
    let group = actFunc.resGroup
    let findGroup = res.find((o) => o.key === group)
    if (!findGroup) {
      findGroup = new object_group()
      findGroup.key = group
      findGroup.title = group
      findGroup.childrenGroups = []
      findGroup.childrenObjs = []
      res.push(findGroup)
    }
    let actObj = null
    let functype = typeof actFunc
    if (functype === typeof object_FixedVal) {
      actObj = new object_FixedVal()
    } else if (functype === typeof object_Method) {
      actObj = new object_Method()
    } else if (functype === typeof object_Signs) {
      actObj = new object_Signs()
    } else if (functype === typeof object_Variable) {
      actObj = new object_Variable()
    } else if (functype === typeof object_callback) {
      actObj = new object_callback()
    }
    findGroup.childrenObjs.push(actObj)
  }
  return res
}
//获取指定类型的方法元数据
export function getFuncObjByGroup(group: resourceGroup) {
  let funcs = allActFunctions.filter((o) => o.resGroup === group)
  debugger
  return funcs
}

export function getFuncObjByType(resType: resourceType) {
  // window.console.log('行为代码2', resType)
  var res = allActFunctions.find((o: any) => o.prototype.$Meta.resType == resType)
  try {
    return new res()
  } catch (error) {
    debugger
    return null
  }
}
