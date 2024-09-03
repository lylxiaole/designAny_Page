/******************************行为相关 **************************/
import { actionObj } from './actObject'

export enum formulaType {
  cute = 'cute', //计算
  filter = 'filter' //判断条件
}
export enum paramType {
  number = 'number',
  string = 'string',
  complexType = 'complexType', //复杂类型
  boolean = 'boolean'
}
export class param {
  key?: string
  name?: string
  val?: any
}

export class variable {
  name: string
  val: any
}

export class action {
  id: string
  name: string
  judgingCondition: actionObj[] = null //动作的判断条件
  actionDetails: (actionDetail | action)[] = []
}

export class actionDetail {
  id: string
  name: string
  detail: string
  isActionDetail: boolean = true
  objs: actionObj[] = []
}

export class behavior {
  id: string = ''
  name: string = ''
  workRange: string = 'page' //page或者component
  description: string = ''
  inparam: any = {} //行为的入参
  variables: variable[] = [] //当前行文的上下文变量
  // actions: action[] = []
  actObjs: actionObj[] = []
  flowData: any
}
