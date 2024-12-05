import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { VueHtmlNodeModel, VueHtmlNode } from './nodeBase'
import nodeDebugBase from './nodeDebugBase.vue'
import ElementPlus from 'element-plus'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { debug } from 'webpack'

//一般性的流程节点
class NodeView extends VueHtmlNode {
  protected isMounted: boolean = false
  protected r: any
  protected app: any

  constructor(props) {
    super(props)
    this.isMounted = false
    //绘制节点
    this.r = h(nodeDebugBase as any, {
      nodeModel: props.model
    })
    this.app = createApp({
      render: () => this.r
    })
    this.app.use(ElementPlus)

    props.model.setActObj = (newactObj) => {
      this.r.component.proxy.actObj = newactObj
    }
  }
}

class NodeModel extends VueHtmlNodeModel {}

export default {
  type: flowNodeType.funcNormalNode,
  model: NodeModel,
  view: NodeView
}
