import { behavior } from './behaviorTypes'
import { getUuid } from '@common/utils'
import { funcCode } from './actFuncBase'
import { param } from './behaviorTypes'

export class object_InParam extends param {
  refOutParamId: string
}

export class actionObj {
  // ******基础信息*********
  id: string //唯一Id
  // resourceId: string //资源得唯一Id，可以用这个ID匹配到资源，
  // pageId?: string //该资源当前所在page,部分页面资源有这个字段。
  name: string
  description: string
  funcCode: funcCode
  // ******运行时信息*********
  preObjIds: string[]
  nextObjIds: string[]
  inputParams: object_InParam[] = []
  outParam: param = null

  get ref(): any {
    return this.getFunc(this)
  }
  set ref(val: any) {
    this.setFunc(this, val)
  }

  get desc(): string {
    return this.getDesc(this)
  }

  public setFunc: (obj: actionObj, val: any) => void = null
  public getFunc: (obj: actionObj) => any = null
  public getDesc: (obj: actionObj) => string = null
  // public updateInparamsFunction: () => void = null

  public cloneFrom(obj: actionObj) {
    this.id = obj.id
    this.objType = obj.objType
    this.name = obj.name
    this.funcCode = obj.funcCode
    this.description = obj.description
    this.inputParams = obj.inputParams
    this.outParam = obj.outParam
  }

  public destory() {
    for (const key in this) {
      this[key] = null
    }
  }
}

/**弹窗回调的配置信息 */
export class popupCallback {
  public id: string
  public modelBindName_InPopupPage: string
  public behaviorId_InMainPage: string
}
