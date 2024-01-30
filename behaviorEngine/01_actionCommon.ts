import { behavior } from './behaviorTypes'
import { getUuid } from '@common/utils'
class signNodeData {
  key: string
  value: string
  title: string
}

//计算符号
export var allCuteSigns: signNodeData[] = [
  { value: '=', key: '=', title: '等于' },
  { value: '+', key: '+', title: '加' },
  { value: '-', key: '-', title: '减' },
  { value: '*', key: '*', title: '乘' },
  { value: '/', key: '/', title: '除' }
]
//判断符号
export var allFilterSigns: signNodeData[] = [
  { value: '==', key: '==', title: '相等于' },
  { value: '!=', key: '!=', title: '不等于' },
  { value: '>', key: '>', title: '大于' },
  { value: '<', key: '<', title: '小于' },
  { value: '>=', key: '>=', title: '大于等于' },
  { value: '<=', key: '<=', title: '小于等于' },
  { value: '&&', key: '&&', title: '且' },
  { value: '||', key: '||', title: '或' }
]

// export enum resourceType {
//   propertiesInPage = 'propertiesInPage',
//   methodsInPage = 'methodsInPage',
//   behaviorInParam = 'behaviorInParam',
//   pageInParams = 'pageInParams',
//   pageContext = 'pageContext',
//   workflows = 'workflows',
//   workflowsAsync = 'workflowsAsync',
//   systemDict = 'systemDict', //系统枚举
//   fileTemplate = 'fileTemplate', //文件模板
//   localStorage = 'localStorage', //本地资源
//   customFunctions = 'customFunctions',
//   controlMethods = 'controlMethods',
//   controlProperties = 'controlProperties',
//   variables = 'variables',
//   fixedVal = 'fixedVal',
//   signs = 'signs',
//   filterSigns = 'filterSigns',
//   models = 'models',
//   modelsStructure = 'modelsStructure',
//   behaviors = 'behaviors',
//   modelsProperty = 'modelsProperty',
//   modelsFilter = 'modelsFilter',
//   modelsPropRule = 'modelsPropRule',
//   normalPopupWindow = 'normalPopupWindow',
//   confirmPopup = 'confirmPopup',
//   pagePopupWindow = 'pagePopupWindow',
//   pageRoute = 'pageRoute',
//   callback = 'callback',
//   modelMapper = 'modelMapper',
//   consoleSettings = 'consoleSettings',
//   externalLinks = 'externalLinks',
//   uploadFile = 'uploadFile', //上传excel文件,以供解析
//   uploadFile_all = 'uploadFile_all', //可自由定义类型的文件上传
//   serverTimeNow = 'serverTimeNow',
//   downloadFile = 'downloadFile',
//   breakBehavior = 'breakBehavior',
//   breakBehaviorAll = 'breakBehaviorAll',
//   controlLoadingWindow = 'controlLoadingWindow',
//   callLocalProgram = 'callLocalProgram',
//   designReportTemplate = 'designReportTemplate', //设计模板
//   reportPrintPreview = 'reportPrintPreview', //打印预览
//   reportPrint = 'reportPrint', //打印
//   openLocalExeToOpenFile = 'openLocalExeToOpenFile',
//   deleteReport = 'deleteReport',
//   pageSources = 'pageSources'
// }

export enum resourceSearchType {
  controlsInPage = 'controlsInPage',
  functions = 'functions',
  behaviorInParam = 'behaviorInParam',
  pageContext = 'pageContext',
  workflows = 'workflows',
  systemDict = 'systemDict', //系统枚举
  fileTemplate = 'fileTemplate', //文件模板
  localStorage = 'localStorage', //本地资源
  customFunctions = 'customFunctions',
  variables = 'variables',
  fixedVal = 'fixedVal',
  signs = 'signs',
  filterSigns = 'filterSigns',
  models = 'models',
  normalPopupWindow = 'normalPopupWindow',
  pagePopupWindow = 'pagePopupWindow',
  pageRoute = 'pageRoute',
  modelMapper = 'modelMapper',
  consoleSettings = 'consoleSettings',
  externalLinks = 'externalLinks',
  pageSources = 'pageSources'
}

// export function resourceFuncAttr(resType: resourceType) {
//   return function (target: Function) {
//     !target.prototype.$Meta && (target.prototype.$Meta = {})
//     target.prototype.$Meta.resType = resType
//   }
// }

export function resourceSearchAttr(resType: any) {
  return function (target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})
    target.prototype.$Meta.resType = resType
  }
}

export enum objectType {
  variable = 'variable', //变量
  fixedVal = 'fixedVal', //固定值
  method = 'method',
  signs = 'signs', //+。-，*，/等运算符
  callback = 'callback'
}

export class objectBase {
  id: string //唯一Id
  resourceId: string //资源得唯一Id，可以用这个ID匹配到资源，
  pageId?: string //该资源当前所在page,部分页面资源有这个字段。
  name: string
  description: string
  objType: objectType
  resourceType: resourceType
  get ref(): any {
    return this.getValFunction(this)
  }
  set ref(val: any) {
    this.setValFunction(this, val)
  }

  get desc(): string {
    if (!this.getDescFunction) {
      // window.console.log('不存在获取描述的方法')
    }
    return this.getDescFunction(this)
  }

  public setValFunction: (obj: objectBase, val: any) => void = null
  public getValFunction: (obj: objectBase) => any = null
  public getDescFunction: (obj: objectBase) => string = null
  public updateInparamsFunction: () => void = null

  public cloneFrom(obj: objectBase) {
    this.id = obj.id
    this.resourceId = obj.resourceId
    this.name = obj.name
    this.pageId = obj.pageId
    this.objType = obj.objType
    this.resourceType = obj.resourceType
    this.description = obj.description
  }

  public static makeNewObject(resourceId: string, name: string, objType: objectType, resType: resourceType, pageId?: string): objectBase {
    var obj = null
    switch (objType) {
      case objectType.fixedVal:
        obj = new object_FixedVal()
        break
      case objectType.variable:
        obj = new object_Variable()
        break
      case objectType.method:
        obj = new object_Method()
        break
      case objectType.signs:
        obj = new object_Signs()
        break
      case objectType.callback:
        obj = new object_callback()
        break
      default:
        break
    }
    obj.resourceType = resType
    obj.resourceId = resourceId
    obj.name = name
    obj.objType = objType
    obj.id = getUuid()
    obj.pageId = pageId
    return obj
  }

  public destory() {
    for (const key in this) {
      this[key] = null
    }
  }
}

export class object_Method_InParam {
  key?: string
  name: string
  isModel: boolean = false //是否是模型
  obj: objectBase
  // callbackbehavior: behavior
}

export class object_Method extends objectBase {
  inputParams: object_Method_InParam[] = []
  outParam: param = null
  dynamic: boolean = false
  cloneFrom(obj: object_Method) {
    super.cloneFrom(obj)
    this.inputParams = obj.inputParams
    this.outParam = obj.outParam
    this.dynamic = obj.dynamic
  }
}
export class object_FixedVal extends objectBase {
  public val: any = ''
  cloneFrom(obj: object_FixedVal) {
    super.cloneFrom(obj)
    this.val = obj.val
  }
}
export class object_Variable extends objectBase {
  cloneFrom(obj: object_Variable) {
    super.cloneFrom(obj)
  }
}
export class object_Signs extends objectBase {
  public sign: string = '='
  cloneFrom(obj: object_Signs) {
    super.cloneFrom(obj)
    this.sign = obj.sign
  }
}

/**弹窗回调的配置信息 */
export class popupCallback {
  public id: string
  public modelBindName_InPopupPage: string
  public behaviorId_InMainPage: string
}

// 行为类型
export class object_callback extends objectBase {
  behavior: behavior
  isChoosePageSource: boolean = false
  pCallbacks: popupCallback[] = []
  cloneFrom(obj: object_callback) {
    super.cloneFrom(obj)
    this.behavior = obj.behavior
    this.pCallbacks = obj.pCallbacks
    if (obj.isChoosePageSource == undefined || obj.isChoosePageSource == null) {
      obj.isChoosePageSource = true
    }
    this.isChoosePageSource = obj.isChoosePageSource
  }
}
