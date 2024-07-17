import { paramType, param } from '@behaviorEngine/index'

export class LayoutMethod {
  methodName?: string = ''
  description?: string = ''
  inParams?: param[] = []
  hasOutParam: boolean = false
  behaviorIds?: string[] = [] //行为的Id
}

export function DMethodAttr(info?: LayoutMethod) {
  return function (target: any, methodField: any, detail: any) {
    debugger
    //扩展属性
    target.apiUrl = 'xxx'
    target.run = function (): void {
      debugger
      console.log('run')
    }
  }
}
