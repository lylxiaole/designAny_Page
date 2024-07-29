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
import { object_Method, objectBase } from '@behaviorEngine/actObject'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import { findFlowNode, flowNodeType } from './flowTypes'
import funcNormalNode from './flowNodes/funcNormalNode'
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
    let allObjs: object_Method[] = []
    //组织流程节点顺序关系
    for (let index = 0; index < graphData.nodes.length; index++) {
      //假设每个遍历的节点都是目标节点
      const targetNode = graphData.nodes[index]
      let targetActObj = targetNode.properties.actObj as object_Method
      // *******遍历所有连线，找寻来源节点、锚点的对应关系**********************************
      let preObjIds = []
      //获取目标节点所有入参的连线
      let preEdges = graphData.edges.filter((o) => o.targetNodeId === targetActObj.id)
      for (let jndex = 0; jndex < preEdges.length; jndex++) {
        const edge = preEdges[jndex]
        if (preObjIds.indexOf(edge.sourceNodeId) < 0) {
          //记录所有入参节点的ID
          preObjIds.push(edge.sourceNodeId)
        }
        //通过连线的目标锚点的Id,找到目标节点对应的入参。如果找不到入参，代表连线仅仅是记录顺序，不传递数据
        let targetInParam = targetActObj.inputParams.find((o) => o.key === edge.targetAnchorId)
        //通过连线的来源节点Id和锚点Id,找到对应的来源节点的出参。
        let sourceNode = graphData.nodes.find((o) => o.id === edge.sourceNodeId)
        let sourceActObj = sourceNode.properties.actObj as object_Method
        let sourceOutParam = sourceActObj.outParam
        if (targetInParam && sourceOutParam) {
          //如果出参和入参都存在。记录下来。
          targetInParam.refOutParamId = sourceOutParam.key
        } else if (targetInParam && !sourceOutParam) {
          //如果目标节点存在入参，但源节点不存在出参。报错并中断
          alert(`节点${targetNode.text}的输入${targetInParam.name}连线错误。来源节点没有输出！请检查`)
          return
        } else if (!targetInParam && sourceOutParam) {
          //如果目标节点不存在入参，但源节点存在出参。通过但不记录，此处仅用于连线作用，不附带参数
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
      ...this.silentConfig
    })
    this.currentFlow.register(funcNormalNode)
    this.currentFlow.register(defaultEdge)
    this.currentFlow.setDefaultEdgeType('defaultEdge')
    this.currentFlow.render(flowdata)
    this.currentFlow.translateCenter()
    this.onFlowCreated(this.currentFlow)
  }
  // ****************拖拽行为******************************
  private isDragOver: boolean = false
  private onDrop(event) {
    if (!event.dataTransfer) {
      return
    }
    let data = event.dataTransfer.getData('application/vueflow')
    let actObj = JSON.parse(data) as objectBase
    let flowNode = findFlowNode(actObj.funcCode)
    if (!flowNode) {
      alert('找不到对应的流程节点')
    }

    this.addFlowNode(flowNode, actObj as object_Method, event.offsetX, event.offsetY)
  }
  private onDragOver(event) {
    event.preventDefault()
    if (true) {
      this.isDragOver = true
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }
  private onDragLeave() {
    this.isDragOver = false
  }
  // ****************流程节点操作******************************
  private addFlowNode(nodeType: flowNodeType, actObj: object_Method, x?, y?) {
    this.currentFlow.addNode({
      id: actObj.id,
      type: nodeType,
      x: x,
      y: y,
      properties: { actObj: actObj }
    })
  }
  private addFlowEdge(sourceNodeId: string, sourceAnchorId: string, targetNodeId: string, targetAnchorId: string) {
    // this.currentFlow.addEdge({
    //   //      sourceNodeId: string;
    //   // sourceAnchorId?: string;
    //   // targetNodeId: string;
    //   // targetAnchorId?: string;
    // })
  }
  // ************************************************************
  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
}
</script>

<style lang="less"   >
@import './flowDesigner.less';
</style>  