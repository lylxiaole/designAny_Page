<template>
  <div style="box-sizing: border-box; width: 100%; height: 100%; background-color: #cdcdcd" class="sql">
    <div style="border-right: 1px solid #cdcdcd; box-sizing: border-box; width: calc(100% - 250px); height: 100%; float: left">
      <div ref="flowarea"></div>
    </div>
    <div style="box-sizing: border-box; width: 250px; height: 100%; float: left">
      <flowNodeDebuggerInfo ref="flowNodeDebuggerInfo" />
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
import flowNodeDebuggerInfo from './flowNodeDebuggerInfo.vue'
import funcNormalNode from '@behaviorEngine/flowDesigner/flowNodes/funcNormalNode'
import onParamJudeNode from '@behaviorEngine/flowDesigner/flowNodes/onParamJudeNode'
import defaultEdge from '@behaviorEngine/flowDesigner/flowEdges/defaultEdge'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { factory } from '@design-any/interface/dist/bahaviorEngine/actionFactory'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'

@Options({
  components: { flowNodeDebuggerInfo }
})
export default class flowDebugger extends ComponentBase {
  private currentFlow: LogicFlow
  private currentFactory: factory

  // ********初始化**************************************
  mounted() {}
  // ****************************************************
  private silentConfig = {
    isSilentMode: true,
    stopScrollGraph: true,
    stopMoveGraph: false,
    stopZoomGraph: false,
    hideAnchors: false,
    edgeTextEdit: true,
    edgeTextDraggable: true
  }
  public async setFlowData(behav: behavior, currentPage: EnginePage) {
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
    // **********************************************
    this.currentFactory = new factory(currentPage, currentPage, behav)
    ;(this.$refs.flowNodeDebuggerInfo as flowNodeDebuggerInfo).startDebugger(this.currentFactory)
    // **********************************************
  }

  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
}
</script>

<style lang="less">
@import '../flowDesigner/flowDesigner.less';
</style>
