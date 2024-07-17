import { funcCode } from '@behaviorEngine/actFuncBase'

const allFlowNodes: any[] = []

export function flowDesignNode(funcCode: funcCode) {
  return function (target: Function) {
    !target.prototype.$Meta && (target.prototype.$Meta = {})

    // window.console.log('DCompnentAttr', target.prototype.$Meta, compCode)
    target.prototype.$Meta.funcCode = funcCode
    allFlowNodes.push(target)
  }
}

export function findFlowNode(funcCode: funcCode) {
  return allFlowNodes.find((o) => o.prototype.$Meta.funcCode === funcCode)
}

export { allFlowNodes }
