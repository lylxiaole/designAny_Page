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

import { findFlowNode } from './flowTypes'

import funcNormalNode from './flowNodes/funcNormalNode'
import defaultEdge from './flowEdges/defaultEdge'
@Options({
  components: {}
})
export default class index extends ComponentBase {
  private currentFlow: LogicFlow
  private flowdata: any = {
    nodes: [],
    edges: []
  }
  private silentConfig = {
    stopScrollGraph: true,
    stopMoveGraph: false,
    stopZoomGraph: false,
    hideAnchors: false
  }

  mounted() {
    this.drawFlow()
  }
  private async drawFlow() {
    await this.$nextTick()
    this.currentFlow = new LogicFlow({
      container: this.$refs.flowarea as any,
      grid: true,
      ...this.silentConfig
    })
    this.currentFlow.register(funcNormalNode)
    this.currentFlow.register(defaultEdge)
    this.currentFlow.setDefaultEdgeType('defaultEdge')
    this.currentFlow.render(this.flowdata)
    this.currentFlow.translateCenter()

    this.onFlowCreated(this.currentFlow)
  }
  public getFlowData() {
    let graphData = this.currentFlow.getGraphData()
    for (let index = 0; index < graphData.edges.length; index++) {
      const edge = graphData.edges[index]

      let sourceNode = this.currentFlow.getNodeModelById(edge.sourceNodeId)
      let targetNode = this.currentFlow.getNodeModelById(edge.targetNodeId)

      debugger
      let sourceAnchor = sourceNode.getAnchorInfo(edge.sourceAnchorId)
      let targetAnchor = targetNode.getAnchorInfo(edge.targetAnchorId)
      debugger
    }

    return null
  }
  // ****************拖拽******************************
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

    this.currentFlow.addNode({
      id: getUuid(),
      type: flowNode,
      x: event.offsetX,
      y: event.offsetY,
      properties: { actObj: actObj }
    })
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

  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
}
</script>

<style lang="less"   >
@import './flowDesigner.less';
</style> ./flowVueNodes/funcNormalNode./flowNodes/funcNormalNode