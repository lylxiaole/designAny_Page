import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { VueHtmlNodeModel, VueHtmlNode } from './nodeBase'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

const anchorSize = 10

//一般性的流程节点
class NodeView extends VueHtmlNode {}

class NodeModel extends VueHtmlNodeModel {
  getDefaultAnchor() {
    //锚点计算
    const {
      id,
      x,
      y,
      width,
      height,
      isHovered,
      isSelected,
      properties: { actObj, isConnection }
    } = this
    let inParams = actObj.inputParams
    let outParam = actObj.outParam

    const anchors = []
    if (outParam) {
      anchors.push({
        x: x + width / 2 - anchorSize,
        y: y - anchorSize / 2 + 30 / 2,
        id: outParam.key,
        name: outParam.name,
        type: anchorType.outParam
      })
    } else {
      anchors.push({
        x: x + width / 2 - anchorSize,
        y: y - anchorSize / 2 + 30 / 2,
        id: makeParamKey(actObj.id, 'output'),
        name: 'NoOutput',
        type: anchorType.justOut
      })
    }
    return anchors
  }
}

export default {
  type: flowNodeType.paramNode,
  model: NodeModel,
  view: NodeView
}
