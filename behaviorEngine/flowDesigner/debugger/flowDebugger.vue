<template>
  <div style="box-sizing: border-box; width: 100%; height: 100%; background-color: #cdcdcd" class="sql">
    <div style="border-right: 1px solid #cdcdcd; box-sizing: border-box; width: calc(100% - 250px); height: 100%; float: left">
      <div ref="flowarea"></div>
    </div>
    <div style="box-sizing: border-box; width: 250px; height: 100%; float: left">
      <flowNodeInfo />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import flowNodeInfo from './flowNodeInfo.vue'

import funcNormalNode from '../flowNodes/funcNormalNode'
import onParamJudeNode from '../flowNodes/onParamJudeNode'
import defaultEdge from '../flowEdges/defaultEdge'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'

@Options({
  components: { flowNodeInfo }
})
export default class flowDebugger extends ComponentBase {
  private currentFlow: LogicFlow

  private silentConfig = {
    isSilentMode: true,
    stopScrollGraph: true,
    stopMoveGraph: false,
    stopZoomGraph: false,
    hideAnchors: false,
    edgeTextEdit: true,
    edgeTextDraggable: true
  }
  // ********初始化**************************************
  mounted() {}

  public async setFlowData(behav: behavior) {
    let flowdata = behav.flowData

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
        enabled: true
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
  }
  // ************************************************************
  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
}
</script>

<style lang="less">
@import '../flowDesigner.less';
</style>
