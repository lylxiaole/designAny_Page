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
    style.fontSize = 30
    style.background.fill = '#F2F131'
    return style
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'red'
    style.hover.stroke = 'red'
    return style
  }
}

export default {
  type: 'defaultEdge',
  view: PolylineEdge,
  model: defaultEdgeModel
}
