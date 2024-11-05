<template>
  <div style="box-sizing: border-box; width: 100%; height: 100%" class="sql">
    <div style="border-right: 1px solid #cdcdcd; box-sizing: border-box; width: calc(100% - 250px); height: 100%; float: left">
      <!-- ***************************** -->
      <el-row v-if="currentFactory" style="width: 100%; height: 40px" class="flexHorilanLayout verticalAlignCenter">
        <!-- <el-button type="primary">Add Breakpoint</el-button> -->
        <el-button type="primary" @click="nextStep">Next Step</el-button>
        <el-button type="primary" @click="onReDo">ReDo</el-button>
        <!-- <el-button type="primary">Next Point</el-button> -->
      </el-row>
      <!-- ***************************** -->
      <div style="width: 100%; height: calc(100% - 40px)" ref="flowarea"></div>
      <!-- ***************************** -->
    </div>
    <!-- ***************************** -->
    <div style="box-sizing: border-box; width: 250px; height: 100%; float: left">
      <flowNodeDebuggerInfo ref="flowNodeDebuggerInfo" :currentSelected="currentSelected" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from '@logicflow/core'
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
  private currentFlow: LogicFlow = null
  private currentFactory: factory = null
  private currentSelected: NodeConfig | EdgeConfig = null
  private orginBehav: behavior = null
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
    this.orginBehav = deepClone(behav)

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
        enabled: true,
        shortcuts: [
          {
            keys: ['delete'],
            callback: () => {
              const r = window.confirm('Sure Delete？')
              if (r) {
                const elements = this.currentFlow.getSelectElements(true)
                this.currentFlow.clearSelectElements()
                elements.edges.forEach((edge) => this.currentFlow.deleteEdge(edge.id))
                elements.nodes.forEach((node) => this.currentFlow.deleteNode(node.id))
              }
            }
          },
          {
            keys: ['backspace'],
            callback: () => {}
          },
          {
            keys: ['ctrl+v', 'ctrl+c'],
            callback: (e) => {}
          }
        ]
      },
      ...this.silentConfig
    })
    // **********************************************
    this.currentFlow.register(funcNormalDebugNode)
    this.currentFlow.register(onParamJudeDebugNode)
    this.currentFlow.register(defaultEdge)
    this.currentFlow.setDefaultEdgeType('defaultEdge')
    this.currentFlow.on('node:click', this.onNodeClick)
    this.currentFlow.on('edge:click', this.onEdgeClick)

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
  // *************************************
  private nextStep() {
    if (!this.currentFactory) {
      return
    }
    this.currentFactory.excuteNextStep()
  }
  private onReDo() {
    this.setFlowData(this.orginBehav, behaviorContext.currentDesignPage)
  }
  // *************************************
  private onNodeClick({ data, e, position }) {
    this.currentSelected = data
  }
  private onEdgeClick({ data, e, position }) {
    this.currentSelected = data
  }
  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
}
</script>

<style lang="less">
@import '../flowDesigner/flowDesigner.less';
</style>
