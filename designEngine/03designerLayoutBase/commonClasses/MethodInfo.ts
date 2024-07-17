import { paramType, param } from '@behaviorEngine/index'

export class LayoutMethod {
  eventName: string = ''
  description: string = ''
  inParams: param[] = []
  outParam: param = null
  behaviorIds: string[] = [] //行为的Id
}

export function DMethodAttr(params: any) {
  return function (target: any, methodsName: any, desc: any) {
    //扩展属性
    target.apiUrl = 'xxx'
    target.run = function (): void {
      console.log('run')
    }
  }
}
