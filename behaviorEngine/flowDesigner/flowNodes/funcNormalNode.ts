import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { VueHtmlNodeModel, VueHtmlNode } from './nodeBase'
import ElementPlus from 'element-plus'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { debug } from 'webpack'

//一般性的流程节点
class NodeView extends VueHtmlNode {}

class NodeModel extends VueHtmlNodeModel {}

export default {
  type: flowNodeType.funcNormalNode,
  model: NodeModel,
  view: NodeView
}
