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
  resourceFilter: any
  name: string
  description: string

  funcCode: funcCode
  // ******运行时信息*********
  preObjIds: string[]
  nextObjIds: string[]

  inputParams: object_InParam[] = []
  outParam: param = null
  excuted: boolean = false

  public cloneFrom(obj: actionObj) {
    this.id = obj.id
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
