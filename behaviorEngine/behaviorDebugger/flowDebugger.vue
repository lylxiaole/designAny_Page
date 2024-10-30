<template>
  <div style="box-sizing: border-box; width: 100%; height: 100%" class="sql">
    <div style="border-right: 1px solid #cdcdcd; box-sizing: border-box; width: calc(100% - 250px); height: 100%; float: left">
      <!-- ***************************** -->
      <el-row style="width: 100%; height: 60px" class="flexHorilanLayout verticalAlignCenter">
        <el-button type="primary">Add Breakpoint</el-button>
        <el-button type="primary" @click="nextStep">Next Step</el-button>
        <el-button type="primary">Next Point</el-button>
      </el-row>
      <!-- ***************************** -->
      <div style="width: 100%; height: calc(100% - 60px)" ref="flowarea"></div>
      <!-- ***************************** -->
    </div>

    <!-- ***************************** -->
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

import funcNormalDebugNode from '@behaviorEngine/flowDesigner/flowNodes/funcNormalDebugNode'
import onParamJudeDebugNode from '@behaviorEngine/flowDesigner/flowNodes/onParamJudeDebugNode'

import defaultEdge from '@behaviorEngine/flowDesigner/flowEdges/defaultEdge'

import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { factory } from '@design-any/interface/dist/bahaviorEngine/actionFactory'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import behaviorContext from '@behaviorEngine/01designerContext/context'

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
    behaviorContext.currentDesignPage = currentPage
    this.currentFactory = new factory(currentPage, currentPage, behav)
    // **********清除行为运行状态**************************************
    for (let index = 0; index < behav.actObjs.length; index++) {
      const element = behav.actObjs[index]
      element.excuted = false
      element.excutedMsg = null
      element.excutedSuccess = false
    }
    // **********************************************
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
    // **********************************************
    this.currentFlow.register(funcNormalDebugNode)
    this.currentFlow.register(onParamJudeDebugNode)
    this.currentFlow.register(defaultEdge)
    this.currentFlow.setDefaultEdgeType('defaultEdge')

    this.currentFlow.render(flowdata)
    this.currentFlow.translateCenter()
    this.onFlowCreated(this.currentFlow)
    // **********************************************
    ;(this.$refs.flowNodeDebuggerInfo as flowNodeDebuggerInfo).startDebugger(this.currentFactory)
    this.currentFactory.onActObjExcuted = this.onActObjExcuted
  }
  private onActObjExcuted(actobj: actionObj) {
    let node = this.currentFlow.getNodeModelById(actobj.id)
    node.setActObj(actobj)
  }

  private nextStep() {
    if (!this.currentFactory) {
      return
    }
    this.currentFactory.excuteNextStep()
  }

  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
}
</script>

<style lang="less">
@import '../flowDesigner/flowDesigner.less';
</style>
