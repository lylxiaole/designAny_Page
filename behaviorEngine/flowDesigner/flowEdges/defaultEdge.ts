import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core'

class defaultEdgeModel extends PolylineEdgeModel {
  getData() {
    const data = super.getData()
    ;(data as any).sourceAnchorId = this.sourceAnchorId
    ;(data as any).targetAnchorId = this.targetAnchorId

    return data
  }

  setAttributes() {
    this.offset = 20
  }
  getAnimation() {
    const animation = super.getAnimation()
    animation.stroke = 'blue'
    return animation
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle()
    const { properties } = this
    if (properties.isActived) {
      style.strokeDasharray = '4 4'
    }
    style.stroke = 'orange'
    return style
  }
  getTextStyle() {
    const style = super.getTextStyle()
    style.color = '#3451F1'
    style.fontSize = 12
    // style.background.fill = '#F2F131'
    return style
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'red'
    style.hover.stroke = 'red'
    return style
  }

  updatePathByAnchor() {
    const sourceNodeModel = this.graphModel.getNodeModelById(this.sourceNodeId)
    const sourceAnchor = sourceNodeModel?.getDefaultAnchor().find((anchor) => anchor.id === this.sourceAnchorId)
    const targetNodeModel = this.graphModel.getNodeModelById(this.targetNodeId)
    const targetAnchor = targetNodeModel?.getDefaultAnchor().find((anchor) => anchor.id === this.targetAnchorId)

    if (sourceAnchor) {
      const startPoint = {
        x: sourceAnchor?.x,
        y: sourceAnchor?.y
      }
      this.updateStartPoint(startPoint)
    }
    if (targetAnchor) {
      const endPoint = {
        x: targetAnchor?.x,
        y: targetAnchor?.y
      }
      this.updateEndPoint(endPoint)
    }
    // 这里需要将原有的pointsList设置为空，才能触发bezier的自动计算control点。
    this.pointsList = []
    this.initPoints()
  }
}

export default {
  type: 'defaultEdge',
  view: PolylineEdge,
  model: defaultEdgeModel
}
