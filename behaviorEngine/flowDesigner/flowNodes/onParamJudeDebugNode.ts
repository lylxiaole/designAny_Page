import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { VueHtmlNodeModel, VueHtmlNode } from './nodeBase'
import nodeDebugBase from '../flowNode_Inner/nodeDebugBase.vue'
import ElementPlus from 'element-plus'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'

const anchorSize = 10
//一般性的流程节点
class NodeView extends VueHtmlNode {
  protected isMounted: boolean = false
  protected r: any
  protected app: any
  protected actObj: actionObj

  constructor(props) {
    super(props)
    this.isMounted = false
    let { actObj } = props.model.getProperties()
    this.actObj = actObj
    //找到actObj的funcCode
    let funcCode = actObj.funcCode
    //绘制节点
    this.r = h(nodeDebugBase as any, {
      funcCode: funcCode,
      nodeModel: props.model,
      actObj: this.actObj
    })

    this.app = createApp({
      render: () => this.r
    })

    this.app.use(ElementPlus)
  }
}

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
    // *********显示入参锚点********************************
    if (inParams && inParams.length > 0) {
      let agvHeight = height / inParams.length
      for (let index = 0; index < inParams.length; index++) {
        let inParam = inParams[index]
        anchors.push({
          x: x - width / 2 - anchorSize / 2,
          y: y - height / 2 + index * agvHeight + agvHeight / 2 - anchorSize / 2,
          id: `${inParam.key}`,
          name: inParam.name,
          edgeAddable: false,
          type: anchorType.inParam
        })
      }
    } else {
      anchors.push({
        x: x - width / 2 - anchorSize / 2,
        y: y,
        id: actObj.id + '_' + anchorType.justIn,
        name: 'NoInput',
        edgeAddable: false,
        type: anchorType.justIn
      })
    }
    // **********显示出参锚点*******************************
    anchors.push({
      x: x + width / 2 - anchorSize,
      y: y - height / 4 - anchorSize,
      id: actObj.id + '_yes',
      name: 'Pass',
      type: anchorType.justOut
    })
    anchors.push({
      x: x + width / 2 - anchorSize,
      y: y + height / 4 - anchorSize,
      id: actObj.id + '_no',
      name: 'NotPass',
      type: anchorType.justOut
    })
    return anchors
  }
}

export default {
  type: flowNodeType.onParamJudeNode,
  model: NodeModel,
  view: NodeView
}
