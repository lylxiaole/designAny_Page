import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h } from 'vue'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { object_Method, objectBase, objectType } from '@behaviorEngine/actObject'

import { findFlowNode } from './flowTypes'

class VueHtmlNode extends HtmlNode {
  private isMounted: boolean = false
  private r: any
  private app: any

  constructor(props) {
    super(props)
    this.isMounted = false
    const { actObj } = props.model.getProperties()
    //找到actObj的funcCode
    let funcCode = (actObj as objectBase).funcCode
    //找到对应的自定义流程节点
    let flowNodeVue = findFlowNode(funcCode)
    //绘制节点
    this.r = h(flowNodeVue as any, {
      properties: props.model.getProperties(),
      text: props.model.inputData
    })
    this.app = createApp({
      render: () => this.r
    })
  }

  getAnchorShape(anchorData) {
    // 找到actObj
    const { actObj } = this.props.model.getProperties()
    const { x, y, type } = anchorData
    console.log('getAnchorShape:', x)
    return lfh('rect', {
      x: x,
      y: y,
      width: 10,
      height: 10,
      className: `anchor`
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
        return sourceAnchor.type === 'outParam'
      }
    })
    this.targetRules.push({
      message: '只允许连接左边的锚点',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === 'inParam'
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
    //锚点计算
    const {
      id,
      x,
      y,
      width,
      height,
      isHovered,
      isSelected,
      properties: { actObj }
    } = this
    console.log('getDefaultAnchor:', x)
    let inParams = []
    let outParam = null

    if (actObj.objType === objectType.method) {
      inParams = (actObj as object_Method).inputParams
      outParam = (actObj as object_Method).outParam
    }

    const anchors = []
    for (let index = 0; index < inParams.length; index++) {
      let inParam = inParams[index]
      anchors.push({
        x: x - width / 2 - 10,
        y: y - height / 2 + index * 30,
        id: `${id}_${index}_left`,
        type: 'inParam'
      })
    }
    if (outParam) {
      // anchors.push({
      //   x: x + width / 2 - 10,
      //   y: y - height / 2 + 60 + 0 * 24,
      //   id: `${id}_0_right`,
      //   type: 'outParam'
      // })
    }

    return anchors
  }

  setIsShowAnchor(flag?: boolean): void {
    super.setIsShowAnchor(true)
  }
}

export default {
  type: 'funcNormalNode',
  model: VueHtmlNodeModel,
  view: VueHtmlNode
}
