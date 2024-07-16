import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h } from 'vue'
import methodInPageNode from './methodInPageNode.vue'

class VueHtmlNode extends HtmlNode {
  private isMounted: boolean = false
  private r: any
  private app: any

  constructor(props) {
    super(props)
    this.isMounted = false
    this.r = h(methodInPageNode as any, {
      properties: props.model.getProperties(),
      text: props.model.inputData
    })
    this.app = createApp({
      render: () => this.r
    })
  }

  getAnchorShape(anchorData) {
    const { x, y, type } = anchorData
    return lfh('rect', {
      x: x - 5,
      y: y - 5,
      width: 10,
      height: 10,
      className: `custom-anchor ${type === 'left' ? 'incomming-anchor' : 'outgoing-anchor'}`
    }) as any
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
    this.width = 100
    this.height = 100
    this.text.editable = false
    this.inputData = this.text.value

    this.sourceRules.push({
      message: '只允许从右边的锚点连出',
      validate: (sourceNode, targetNode, sourceAnchor) => {
        return sourceAnchor.type === 'right'
      }
    })
    this.targetRules.push({
      message: '只允许连接左边的锚点',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === 'left'
      }
    })

    this.setIsShowAnchor()
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'blue'
    style.hover.stroke = 'blue'
    return style
  }
  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo)

    if (anchorInfo.type === 'left') {
      style.fill = 'red'
      style.hover.fill = 'red'
      style.hover.stroke = 'red'
    } else {
      style.fill = 'green'
      style.hover.fill = 'green'
      style.hover.stroke = 'green'
    }
    return style
  }
  getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
      height,
      isHovered,
      isSelected,
      properties: { fields, isConnection }
    } = this

    const anchors = []
    for (let index = 0; index < 4; index++) {
      anchors.push({
        x: x + width / 2 - 10,
        y: y - height / 2 + 60 + index * 24,
        id: `${id}_${index}_right`,
        type: 'right'
      })
    }
    return anchors
  }

  setIsShowAnchor(flag?: boolean): void {
    super.setIsShowAnchor(true)
  }
}

export default {
  type: 'methodInPageNode',
  model: VueHtmlNodeModel,
  view: VueHtmlNode
}
