export function DMethodAttr(params: any) {
  return function (target: any, methodsName: any, desc: any) {
    //扩展属性
    target.apiUrl = 'xxx'
    target.run = function (): void {
      console.log('run')
    }
  }
}
