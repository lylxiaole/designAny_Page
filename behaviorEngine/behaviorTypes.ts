/******************************行为相关 **************************/
import { objectBase, objectType } from './01_actionCommon'

//布局的事件所包含的行为列表
export class layoutEventBehaviors {
  eventName: string //布局的事件名称
  behaviorIds: string[] = [] //行为的Id
}

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
