import { HtmlNode, HtmlNodeModel, h as lfh } from '@logicflow/core'
import { createApp, h, VNode, render, ref } from 'vue'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { actionObj } from '@behaviorEngine/actObject'
import { findFlowNodeInner, anchorType } from '../flowTypes'
import { getUuid } from '@common/utils'
import ElementPlus from 'element-plus'
import nodeBase from '../flowNode_Inner/nodeBase.vue'
import { HtmlResize } from '@logicflow/extension'
import '@logicflow/extension/lib/style/index.css'
const anchorSize = 10
//一般性的流程节点
class VueHtmlNode extends HtmlResize.view {
  private isMounted: boolean = false
  private r: any
  private app: any
  constructor(props) {
    super(props)
    this.isMounted = false
    let { actObj } = props.model.getProperties()

    //找到actObj的funcCode
    let funcCode = actObj.funcCode
    //绘制节点
    this.r = h(nodeBase as any, {
      funcCode: funcCode,
      nodeModel: props.model
    })

    this.app = createApp({
      render: () => this.r
    })

    this.app.use(ElementPlus)
  }

  getAnchorShape(anchorData) {
    // 找到actObj
    const { actObj } = this.props.model.getProperties()
    const { x, y, type, name } = anchorData
    console.log('anchorData:', anchorData, this.props.model)

    let rect = { x: x, y: y, width: anchorSize, height: anchorSize, stroke: '#000000', strokeDasharray: '3 3' }
    let text = { x: x, y: y, fontSize: 8, fill: 'black', textAnchor: 'middle' }
    return lfh('g', {}, [lfh('rect', rect, []), lfh('text', text, [name])])
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

class VueHtmlNodeModel extends HtmlResize.model {
  initNodeData(data) {
    super.initNodeData(data)

    this.width = 150
    this.height = 150
    this.maxWidth = 800
    this.maxHeight = 800
  }
  setAttributes() {
    this.text.editable = false
    this.inputData = this.text.value
    this.setIsShowAnchor()
    this.sourceRules.push({
      message: '只允许从右边的锚点连出',
      validate: (sourceNode, targetNode, sourceAnchor) => {
        return sourceAnchor.type === anchorType.outParam || sourceAnchor.type === anchorType.justOut
      }
    })
    this.targetRules.push({
      message: '只允许连接左边的锚点',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === anchorType.inParam || targetAnchor.type === anchorType.justIn
      }
    })
    //限定 一个入参锚点只能连一条线
    this.sourceRules.push({
      message: '目标已存在连线，不可重复连线',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        let find = this.graphModel.edges.find((o) => o.targetNodeId === targetNode.id && o.targetAnchorId === targetAnchor.id)
        if (!find) {
          return true
        } else {
          return false
        }
      }
    })
  }
  getResizeOutlineStyle() {
    return {
      stroke: '#000000',
      strokeWidth: 1,
      strokeDasharray: '3,3'
    }
  }
  getControlPointStyle() {
    return {
      width: 7,
      height: 7,
      fill: '#FFFFFF',
      stroke: '#000000'
    }
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
    if (inParams && inParams.length > 0) {
      let agvHeight = height / inParams.length
      for (let index = 0; index < inParams.length; index++) {
        let inParam = inParams[index]
        anchors.push({
          x: x - width / 2 - anchorSize / 2,
          y: y - height / 2 + index * agvHeight + agvHeight / 2 - anchorSize / 2,
          id: `${inParam.key}`,
          name: inParam.name,
          edgeAddable: false,
          type: anchorType.inParam
        })
      }
    } else {
      anchors.push({
        x: x - width / 2 - anchorSize / 2,
        y: y,
        id: actObj.id + '_' + anchorType.justIn,
        name: '无输入',
        edgeAddable: false,
        type: anchorType.justIn
      })
    }
    // **********显示出参锚点*******************************
    // if (!isConnection) {
    if (outParam) {
      anchors.push({
        x: x + width / 2 - anchorSize,
        y: y - anchorSize / 2,
        id: outParam.key,
        name: outParam.name,
        type: anchorType.outParam
      })
    } else {
      anchors.push({
        x: x + width / 2 - anchorSize,
        y: y - anchorSize / 2,
        id: actObj.id + '_' + anchorType.justOut,
        name: '无输出',
        type: anchorType.justOut
      })
    }

    // }
    return anchors
  }

  updateAnchor() {
    this.incoming.edges.forEach((egde) => {
      // 调用自定义的更新方案
      egde.updatePathByAnchor()
    })
    this.outgoing.edges.forEach((edge) => {
      edge.updatePathByAnchor()
    })

    this.setAttributes()
  }

  setIsShowAnchor(flag?: boolean) {
    super.setIsShowAnchor(true)
  }
}

export { VueHtmlNodeModel, VueHtmlNode }
