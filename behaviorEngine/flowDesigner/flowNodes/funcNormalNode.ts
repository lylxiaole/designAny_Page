import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render } from 'vue'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { actionObj } from '@behaviorEngine/actObject'
import { findFlowNodeInner, anchorType } from '../flowTypes'
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
    if (type === anchorType.outParam || type === anchorType.justOut) {
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
        return sourceAnchor.type === anchorType.outParam || sourceAnchor.type === anchorType.justOut
      }
    })
    //TODO 需要设定 一个入参锚点只能连一条线
    this.sourceRules.push({
      message: '当前入参已存在连线，不可重复连线',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        let sourceObj = sourceNode.properties.actObj
        let targetObj = sourceNode.properties.actObj

        let find = this.graphModel.edges.find((o) => o.targetNodeId === targetNode.id && o.targetAnchorId === targetAnchor.id)
        if (!find) {
          return true
        } else {
          return false
        }
      }
    })

    this.targetRules.push({
      message: '只允许连接左边的锚点',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === anchorType.inParam || targetAnchor.type === anchorType.justIn
      }
    })
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'blue'
    style.hover.stroke = 'blue'
    return style
  }
  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo)

    if (anchorInfo.type === anchorType.inParam || anchorInfo.type === anchorType.justIn) {
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
      properties: { actObj, isConnection }
    } = this
    let inParams = actObj.inputParams
    let outParam = actObj.outParam

    const anchors = []

    // *********显示入参锚点********************************
    if (isConnection || !(isHovered || isSelected)) {
      if (inParams && inParams.length > 0) {
        let agvHeight = height / inParams.length
        for (let index = 0; index < inParams.length; index++) {
          let inParam = inParams[index]
          anchors.push({
            x: x - width / 2 - 10,
            y: y - height / 2 + index * agvHeight + agvHeight / 2,
            id: `${inParam.key}`,
            name: inParam.name,
            edgeAddable: false,
            type: anchorType.inParam,
            text: inParam.name
          })
        }
      } else {
        anchors.push({
          x: x - width / 2,
          y: y - height / 2,
          id: actObj.id + '_in',
          name: '',
          edgeAddable: false,
          type: anchorType.justIn,
          text: '连线'
        })
      }
    }
    // **********显示出参锚点*******************************
    if (!isConnection) {
      if (outParam) {
        anchors.push({
          x: x + width / 2,
          y: y,
          id: outParam.key,
          name: outParam.name,
          type: anchorType.outParam,
          text: '输出'
        })
      } else {
        anchors.push({
          x: x + width / 2,
          y: y,
          id: actObj.id + '_out',
          name: '',
          type: anchorType.justOut,
          text: '连线'
        })
      }
    }
    return anchors
  }
}

export default {
  type: flowNodeType.funcNormalNode,
  model: VueHtmlNodeModel,
  view: VueHtmlNode
}
