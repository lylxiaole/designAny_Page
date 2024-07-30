import Vue from 'vue'
import { getUuid } from '@common/utils'
import { EngineComponent, EnginePage } from '@designEngine/03designerLayoutBase'
import EngineLayout from '@designEngine/03designerLayoutBase/EngineLayout'
import { behavior } from './behaviorTypes'

import { actionObj } from './actObject'

//方法资源分组
export enum funcGroup {
  fixedVal = 'fixedVal',
  cuteSigns = 'cuteSigns',
  filterSigns = 'filterSigns',
  variables = 'variables',
  pageOption = 'pageOption'
}
//方法编码-需要保证唯一性
export enum funcCode {
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

  leadToPage = 'leadToPage',

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
export function resourceFuncAttr(name: string, desc: string, funcGroup?: funcGroup, funcCode?: funcCode, funcStack?: funcStack) {
  return function (target: Function) {
    !target.prototype.$lyl_actFunc && (target.prototype.$lyl_actFunc = {})
    target.prototype.$lyl_actFunc.funcCode = funcCode
    target.prototype.$lyl_actFunc.funcStack = funcStack
    target.prototype.$lyl_actFunc.funcGroup = funcGroup
    target.prototype.$lyl_actFunc.name = name
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

  excute(): any
}
