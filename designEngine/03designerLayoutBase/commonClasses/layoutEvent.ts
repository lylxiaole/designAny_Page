import { paramType, param } from '@behaviorEngine/index'

export class layoutEvent {
  eventName: string = ''
  description: string = ''
  inParams: param[] = []
  outParam: param = null
  behaviorIds: string[] = [] //行为的Id
}

export class layoutMethod extends layoutEvent {
  callback: Function
}
