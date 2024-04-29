import { paramType, param } from '@behaviorEngine/index'

//布局的事件所包含的行为列表
export class layoutEventBehaviors {
  eventName: string //布局的事件名称
  behaviorIds: string[] = [] //行为的Id
}

export class layoutEvent {
  eventName: string = ''
  description: string = ''
  inParams: param[] = []
  outParam: param = null
  behaviorIds: string[] = [] //行为的Id
}

export class layoutMethod extends layoutEvent {}
