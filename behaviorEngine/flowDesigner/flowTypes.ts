import { funcCode } from '@behaviorEngine/actFuncBase'

const allFlowNodes: any[] = []

export function flowDesignNode(funcCode: funcCode) {
  return function (target: Function) {
    !target.prototype.$lyl_flowNode && (target.prototype.$lyl_flowNode = {})
    // window.console.log('DCompnentAttr', target.prototype.$lyl_flowNode, compCode)
    target.prototype.$lyl_flowNode.funcCode = funcCode
    allFlowNodes.push(target)
  }
}

export function findFlowNode(funcCode: funcCode) {
  return allFlowNodes.find((o) => o.prototype.$lyl_flowNode.funcCode === funcCode)
}

export { allFlowNodes }
