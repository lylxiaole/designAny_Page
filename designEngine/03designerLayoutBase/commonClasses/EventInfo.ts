import { paramType, param } from '@behaviorEngine/index'

//布局的事件所包含的行为列表
export class LayoutEventBehaviors {
  eventName: string //布局的事件名称
  behaviorIds: string[] = [] //行为的Id
}

export class LayoutEvent {
  eventName: string = ''
  description: string = ''
  inParams: param[] = []
  outParam: param = null
  behaviorIds: string[] = [] //行为的Id
}
