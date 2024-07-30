import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { actionObj, objectType } from '@behaviorEngine/actObject'
import { findFlowNodeInner } from '../flowTypes'
import { getUuid } from '@common/utils'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'

//一般性的流程节点
class VueHtmlNode extends HtmlNode {
  isMounted = false
  r
  app

  constructor(props) {
    super(props)
    this.isMounted = false
    const { actObj } = props.model.getProperties()
    //找到actObj的funcCode
    let funcCode = actObj.funcCode
    //找到对应的自定义流程节点
    let flowNodeVue = findFlowNodeInner(funcCode)
    //绘制节点
    this.r = h(flowNodeVue, {
      actObj: actObj
    })
    this.app = createApp({
      render: () => this.r
    })
  }
  getAnchorShape(anchorData) {
    // 找到actObj
    const { actObj } = this.props.model.getProperties()
    const { x, y, type, text } = anchorData
    let textPositionX = -15
    if (type === 'outParam' || type === 'just_out') {
      textPositionX = 8
    } else {
      textPositionX = -20
    }

    return lfh('g', {}, [lfh('rect', { x: x, y: y, width: 10, height: 10, stroke: '#000000', strokeDasharray: '3 3' }), lfh('text', { x: x + textPositionX, y: y }, [text])])
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
    this.width = 120
    this.height = 120
    this.text.editable = false
    this.inputData = this.text.value

    this.sourceRules.push({
      message: '只允许从右边的锚点连出',
      validate: (sourceNode, targetNode, sourceAnchor) => {
        return sourceAnchor.type === 'outParam' || sourceAnchor.type === 'just_out'
      }
    })
    this.targetRules.push({
      message: '只允许连接左边的锚点',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === 'inParam' || targetAnchor.type === 'just_in'
      }
    })

    this.setIsShowAnchor(true)
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'blue'
    style.hover.stroke = 'blue'
    return style
  }
  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo)

    if (anchorInfo.type === 'inParam' || anchorInfo.type === 'just_in') {
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
    let inParams = []
    let outParam = null

    if (actObj.objType === objectType.method) {
      inParams = actObj.inputParams
      outParam = actObj.outParam
    }

    const anchors = []
    //TODO 需要设定 一个入参锚点只能连一条线
    if (inParams.length > 0) {
      let agvHeight = height / inParams.length
      for (let index = 0; index < inParams.length; index++) {
        let inParam = inParams[index]
        anchors.push({
          x: x - width / 2 - 10,
          y: y - height / 2 + index * agvHeight + agvHeight / 2,
          id: `${inParam.key}`,
          name: inParam.name,
          type: 'inParam',
          text: inParam.name
        })
      }
    } else {
      anchors.push({
        x: x - width / 2,
        y: y - height / 2,
        id: actObj.id + '_in',
        name: '',
        type: 'just_in',
        text: '连线'
      })
    }

    if (outParam) {
      anchors.push({
        x: x + width / 2,
        y: y,
        id: outParam.key,
        name: outParam.name,
        type: 'outParam',
        text: '输出'
      })
    } else {
      anchors.push({
        x: x + width / 2,
        y: y,
        id: actObj.id + '_out',
        name: '',
        type: 'just_out',
        text: '连线'
      })
    }

    return anchors
  }
  setIsShowAnchor(flag) {
    super.setIsShowAnchor(true)
  }
}

export default {
  type: flowNodeType.funcNormalNode,
  model: VueHtmlNodeModel,
  view: VueHtmlNode
}
