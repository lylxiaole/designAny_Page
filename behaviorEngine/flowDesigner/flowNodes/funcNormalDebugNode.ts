import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { VueHtmlNodeModel, VueHtmlNode } from './nodeBase'
import nodeDebugBase from '../flowNode_Inner/nodeDebugBase.vue'
import ElementPlus from 'element-plus'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'

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

    actObj.excuted = false
    actObj.excutedMsg = null
    actObj.excutedSuccess = false

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

class NodeModel extends VueHtmlNodeModel {}

export default {
  type: flowNodeType.funcNormalNode,
  model: NodeModel,
  view: NodeView
}
