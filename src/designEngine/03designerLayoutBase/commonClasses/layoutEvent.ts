export enum paramType {
  number = 'number',
  string = 'string',
  complexType = 'complexType', //复杂类型
  boolean = 'boolean'
}

export class param {
  name: string
  type: paramType
  val: any
}

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
