import { RectNode, RectNodeModel, HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { createApp, ref, h } from 'vue'
import methodInPageNode from './methodInPageNode.vue'

class VueHtmlNode extends HtmlNode {
  private isMounted: boolean = false
  private r: any
  private app: any

  constructor(props) {
    super(props)
    this.isMounted = false
    this.r = h(methodInPageNode, {
      properties: props.model.getProperties(),
      text: props.model.inputData
    })
    this.app = createApp({
      render: () => this.r
    })
  }
  setHtml(rootEl) {
    if (!this.isMounted) {
      this.isMounted = true
      const node = document.createElement('div')
      rootEl.appendChild(node)
      this.app.mount(node)
    } else {
      this.r.component.props.properties = this.props.model.getProperties()
    }
  }
}

class VueHtmlNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false
    this.inputData = this.text.value

    const width = 100
    const height = 100
    this.width = width
    this.height = height
    this.anchorsOffset = [
      [width / 2, 0],
      [0, height / 2],
      [-width / 2, 0],
      [0, -height / 2]
    ]
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = '#000000'
    style.strokeWidth = 2
    style.strokeDasharray = '3 3'
    return style
  }
  //锚点数据
  getData() {
    const data = super.getData()
    data.sourceAnchorId = this.sourceAnchorId
    data.targetAnchorId = this.targetAnchorId
    return data
  }
  /**
   * 给边自定义方案，使其支持基于锚点的位置更新边的路径
   */
  updatePathByAnchor() {
    // TODO
    const sourceNodeModel = this.graphModel.getNodeModelById(this.sourceNodeId)
    const sourceAnchor = sourceNodeModel.getDefaultAnchor().find((anchor) => anchor.id === this.sourceAnchorId)
    const targetNodeModel = this.graphModel.getNodeModelById(this.targetNodeId)
    const targetAnchor = targetNodeModel.getDefaultAnchor().find((anchor) => anchor.id === this.targetAnchorId)
    const startPoint = {
      x: sourceAnchor.x,
      y: sourceAnchor.y
    }
    this.updateStartPoint(startPoint)
    const endPoint = {
      x: targetAnchor.x,
      y: targetAnchor.y
    }
    this.updateEndPoint(endPoint)
    // 这里需要将原有的pointsList设置为空，才能触发bezier的自动计算control点。
    this.pointsList = []
    this.initPoints()
  }
}

export default {
  type: 'methodInPageNode',
  view: VueHtmlNode,
  model: VueHtmlNodeModel
}
