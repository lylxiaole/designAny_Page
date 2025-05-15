import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { VueHtmlNodeModel, VueHtmlNode } from './nodeBase'
import ElementPlus from 'element-plus'
import nodeDesignUI from './nodeDesignUI.vue'

//一般性的流程节点
class NodeView extends VueHtmlNode {
  constructor(props) {
    super(props)
    this.isMounted = false
    //找到actObj的funcCode
    //绘制节点
    this.r = h(nodeDesignUI as any, {
      nodeModel: props.model
    })

    this.app = createApp({
      render: () => this.r
    })

    this.app.use(ElementPlus)
  }
}

class NodeModel extends VueHtmlNodeModel {}

export default {
  type: flowNodeType.funcNormalNode,
  model: NodeModel,
  view: NodeView
}
