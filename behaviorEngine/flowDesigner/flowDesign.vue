<template>
  <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd" class="sql" @drop="onDrop" @dragover="onDragOver"
    @dragleave="onDragLeave">
    <div ref="flowarea"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import funcNormalNode from './flowNodes/funcNormalNode'
import onParamJudeNode from './flowNodes/onParamJudeNode'

import defaultEdge from './flowEdges/defaultEdge'

@Options({
  components: {}
})
export default class index extends ComponentBase {
  private currentFlow: LogicFlow

  private silentConfig = {
    stopScrollGraph: true,
    stopMoveGraph: false,
    stopZoomGraph: false,
    hideAnchors: false
  }
  // ********初始化**************************************
  mounted() {}
  // *********保存时，获取流程数据，转换成行为列表***********
  public getFlowData(): any {
    let graphData = this.currentFlow.getGraphRawData()

    let allObjs: actionObj[] = []
    //组织流程节点顺序关系
    for (let index = 0; index < graphData.nodes.length; index++) {
      //假设每个遍历的节点都是目标节点
      const targetNode = graphData.nodes[index]
      let targetActObj = targetNode.properties.actObj as actionObj
      // *******遍历所有连线，找寻来源节点、锚点的对应关系**********************************
      let preObjIds = []
      //获取目标节点所有入参的连线
      let preEdges = graphData.edges.filter((o) => o.targetNodeId === targetActObj.id)
      if (preEdges.length < 1) {
        //目标节点没有上级连接，清除所有入参refOutParamId
        for (let index = 0; index < targetActObj.inputParams.length; index++) {
          const targetinparam = targetActObj.inputParams[index]
          targetinparam.refOutParamId = null
        }
      } else {
        //目标节点有上级连接，组织所有入参refOutParamId
        for (let jndex = 0; jndex < preEdges.length; jndex++) {
          let preObjId = null
          const edge = preEdges[jndex]
          //通过连线的目标锚点的Id,找到目标节点对应的入参。如果找不到入参，代表连线仅仅是记录顺序，不传递数据
          let targetInParam = targetActObj.inputParams.find((o) => o.key === edge.targetAnchorId)
          //通过连线的来源节点Id和锚点Id,找到对应的来源节点的出参。
          let sourceNode = graphData.nodes.find((o) => o.id === edge.sourceNodeId)
          let sourceActObj = sourceNode.properties.actObj as actionObj
          let sourceOutParam = sourceActObj.outParam

          //连线的文本，当作目标入参的值的筛选条件
          if (edge.text && targetInParam) {
            let inParamValueFilter = edge.text as any
            targetInParam.valueFilter = inParamValueFilter.value
          } else if (!edge.text && targetInParam) {
            targetInParam.valueFilter = null
          }
          //开始计算ActObj的连线
          if (sourceActObj.isJudeNode == true) {
            //如果源节点是判断节点，需要特殊处理。判断节点没有出参。
            preObjId = edge.sourceAnchorId
            debugger
          } else if (!sourceOutParam) {
            //如果源节点是没有出参的普通节点
            preObjId = edge.sourceNodeId
          } else if (targetInParam && sourceOutParam) {
            //如果源节点是普通节点。源节点的出参连线到的是目标节点的入参
            preObjId = edge.sourceNodeId
            targetInParam.refOutParamId = sourceOutParam.key
          } else if (targetInParam && !sourceOutParam) {
            preObjId = edge.sourceNodeId
            //如果目标节点存在入参，但源节点不存在出参。报错并中断
            alert(`节点${targetNode.text}的输入${targetInParam.name}连线错误。来源节点没有输出！请检查`)
            throw `节点${targetNode.text}的输入${targetInParam.name}连线错误。来源节点没有输出！请检查`
          } else if (!targetInParam && sourceOutParam) {
            //如果目标节点不存在入参，但源节点存在出参。通过但不记录，此处仅用于连线作用，不附带参数
            preObjId = edge.sourceNodeId
          }

          //记录所有来源节点的ID
          if (preObjIds.indexOf(preObjId) < 0) {
            preObjIds.push(preObjId)
          }
        }
      }

      targetActObj.preObjIds = preObjIds
      // *******遍历所有连线,找到下级目标节点的Id**********************************
      let nextObjIds = []
      // 获取目标节点所有出参的连线
      let nextEdges = graphData.edges.filter((o) => o.sourceNodeId === targetActObj.id)
      for (let jndex = 0; jndex < nextEdges.length; jndex++) {
        const edge = nextEdges[jndex]
        if (nextObjIds.indexOf(edge.targetNodeId) < 0) {
          //记录所有入参节点的ID
          nextObjIds.push(edge.targetNodeId)
        }
      }
      targetActObj.nextObjIds = nextObjIds
      // *****************************************
      allObjs.push(targetActObj)
    }

    return { allObjs: allObjs, flowData: graphData }
  }

  public async setFlowData(flowdata: any) {
    if (!flowdata) {
      flowdata = {
        nodes: [],
        edges: []
      }
    }

    this.currentFlow = new LogicFlow({
      container: this.$refs.flowarea as any,
      grid: true,
      keyboard: {
        enabled: true,
        shortcuts: [
          {
            keys: ['backspace', 'delete'],
            callback: () => {
              const r = window.confirm('确定要删除吗？')
              if (r) {
                const elements = this.currentFlow.getSelectElements(true)
                this.currentFlow.clearSelectElements()
                elements.edges.forEach((edge) => this.currentFlow.deleteEdge(edge.id))
                elements.nodes.forEach((node) => this.currentFlow.deleteNode(node.id))
              }
            }
          }
        ]
      },
      ...this.silentConfig
    })
    this.currentFlow.register(onParamJudeNode)

    this.currentFlow.register(funcNormalNode)
    this.currentFlow.register(defaultEdge)
    this.currentFlow.setDefaultEdgeType('defaultEdge')
    this.currentFlow.render(flowdata)
    this.currentFlow.translateCenter()
    this.onFlowCreated(this.currentFlow)

    this.currentFlow.on('connection:not-allowed', this.onEdgeConnectNotAllowed)
    this.currentFlow.on('anchor:dragstart', this.onAnchorDragStart)
    this.currentFlow.on('anchor:dragend', this.onAnchorDragEnd)
  }
  // ****************流程图事件****************************
  private async onEdgeConnectNotAllowed(msg) {
    alert(msg.msg)
  }

  private onAnchorDragStart({ data, nodeModel }) {
    this.currentFlow.graphModel.nodes.forEach((node) => {
      if (nodeModel.id !== node.id) {
        node.isShowAnchor = true
        node.setProperties({
          isConnection: true
        })
      }
    })
  }

  private onAnchorDragEnd({ data, nodeModel }) {
    this.currentFlow.graphModel.nodes.forEach((node) => {
      if (nodeModel.id !== node.id) {
        node.isShowAnchor = false
        this.currentFlow.deleteProperty(node.id, 'isConnection')
      }
    })
  }
  // ****************拖拽行为******************************
  private isDragOver: boolean = false
  private onDrop(event) {
    this.isDragOver = false
    this.currentFlow.dnd.onDrop(event)
  }
  private onDragOver(event) {
    event.preventDefault()
    this.isDragOver = true
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }
  private onDragLeave() {
    this.isDragOver = false
  }
  // ************************************************************
  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
}
</script>

<style lang="less"   >
@import './flowDesigner.less';
</style>  ./flowNodes/oneParamJudeNode