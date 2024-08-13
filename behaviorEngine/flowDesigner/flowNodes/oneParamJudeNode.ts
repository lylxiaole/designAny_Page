import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { actionObj } from '@behaviorEngine/actObject'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import { VueHtmlNodeModel, VueHtmlNode } from './nodeBase'

//一般性的流程节点
class NodeView extends VueHtmlNode {}

class NodeModel extends VueHtmlNodeModel {}

export default {
  type: flowNodeType.oneParamJudeNode,
  model: NodeModel,
  view: NodeView
}
