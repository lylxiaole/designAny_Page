import { funcCode } from '@behaviorEngine/actFuncBase'

//节点类型
export enum flowNodeType {
  funcNormalNode = 'funcNormalNode'
}
//锚点类型
export enum anchorType {
  inParam = 'inParam',
  outParam = 'outParam',
  justIn = 'just_in',
  justOut = 'just_out'
}

const allFlowNodes: any[] = []
export function flowDesignNode(funcCode: funcCode, flowNode: flowNodeType) {
  return function (target: Function) {
    !target.prototype.$lyl_flowNode && (target.prototype.$lyl_flowNode = {})
    // window.console.log('DCompnentAttr', target.prototype.$lyl_flowNode, compCode)
    target.prototype.$lyl_flowNode.funcCode = funcCode
    target.prototype.$lyl_flowNode.flowNode = flowNode
    allFlowNodes.push(target)
  }
}
export function findFlowNodeInner(funcCode: funcCode) {
  let find = allFlowNodes.find((o) => o.prototype.$lyl_flowNode.funcCode === funcCode)

  if (find) {
    return find
  } else {
    return allFlowNodes.find((o) => o.prototype.$lyl_flowNode.flowNode === flowNodeType.funcNormalNode && !o.prototype.$lyl_flowNode.funcCode)
  }
}
export function findFlowNode(funcCode: funcCode) {
  let find = allFlowNodes.find((o) => o.prototype.$lyl_flowNode.funcCode === funcCode)
  if (find) {
    return find.prototype.$lyl_flowNode.flowNode
  } else {
    return flowNodeType.funcNormalNode
  }
}

export { allFlowNodes }
