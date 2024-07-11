import { behavior } from './behaviorTypes'
import { getUuid } from '@common/utils'
import { resourceCode } from './actFuncBase'
import { param } from './behaviorTypes'

export class object_group {
  key: string //node节点的key
  title: string //node节点的标题
  childrenObjs: objectBase[] = [] //node节点的子级,有可能是
  childrenGroups: object_group[] = []
}
export enum objectType {
  variable = 'variable', //变量
  fixedVal = 'fixedVal', //固定值
  method = 'method',
  signs = 'signs' //+。-，*，/等运算符
  // callback = 'callback'
}

export class objectBase {
  id: string //唯一Id
  // resourceId: string //资源得唯一Id，可以用这个ID匹配到资源，
  // pageId?: string //该资源当前所在page,部分页面资源有这个字段。
  name: string
  description: string
  objType: objectType
  resourceCode: resourceCode

  get ref(): any {
    return this.getFunc(this)
  }
  set ref(val: any) {
    this.setFunc(this, val)
  }

  get desc(): string {
    return this.getDesc(this)
  }

  public setFunc: (obj: objectBase, val: any) => void = null
  public getFunc: (obj: objectBase) => any = null
  public getDesc: (obj: objectBase) => string = null
  // public updateInparamsFunction: () => void = null

  public cloneFrom(obj: objectBase) {
    this.id = obj.id
    this.objType = obj.objType
    // this.resourceId = obj.resourceId
    this.name = obj.name
    // this.pageId = obj.pageId
    // this.objType = obj.objType
    this.resourceCode = obj.resourceCode
    this.description = obj.description
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
