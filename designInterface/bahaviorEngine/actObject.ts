import { behavior } from './behavior'
import { getUuid } from '../utils'
import { funcCode } from './actFunc'
import { param } from './behavior'

export class object_group {
  key: string //node节点的key
  title: string //node节点的标题
  childrenObjs: actionObj[] = [] //node节点的子级,有可能是
  childrenGroups: object_group[] = []
}

export class object_InParam extends param {
  refOutParamId?: string
  valueFilter?: string
}

export class actionObj {
  // ******基础信息*********
  id: string //唯一Id
  // resourceId: string //资源得唯一Id，可以用这个ID匹配到资源，
  resourceFilter: any
  name: string
  description: string
  funcCode: funcCode
  isJudeNode: boolean = false //是否是判断节点。判断节点会根据返回结果的true/false,再决定执行哪些子级

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
