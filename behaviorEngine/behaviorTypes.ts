/******************************行为相关 **************************/
import { objectBase, objectType } from './01_actionCommon'

export class variable {
  name: string
  val: any
}

export class behavior {
  id: string = ''
  name: string = ''
  description: string = ''
  variableFormulas: any = {} //废弃
  inparam: any = {} //行为的入参
  variables: variable[] = [] //当前行文的上下文变量
  actions: action[] = []
}

export class action {
  id: string
  name: string
  judgingCondition: objectBase[] = null //动作的判断条件
  actionDetails: (actionDetail | action)[] = []
}

export class actionDetail {
  id: string
  name: string
  detail: string
  isActionDetail: boolean = true
  objs: objectBase[] = []
}
