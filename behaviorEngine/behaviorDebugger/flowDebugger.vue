<template>
  <div style="box-sizing: border-box; width: 100%; height: 100%" class="sql">
    <div style="border-right: 1px solid #cdcdcd; box-sizing: border-box; width: calc(100% - 250px); height: 100%; float: left">
      <!-- ***************************** -->
      <el-row v-show="currentFactory" style="width: 100%; height: 40px" class="flexHorilanLayout verticalAlignCenter">
        <!-- <el-button type="primary">Add Breakpoint</el-button> -->
        <el-button type="primary" @click="nextStep">{{$t('tip.NextStep')}}</el-button>
        <el-button type="primary" @click="onReDo">{{$t('tip.ReDo')}}</el-button>
        <el-button type="primary" @click="editBehaviorClick">{{$t('tip.EditBehavior')}}</el-button>
        <!-- <el-button type="primary">Next Point</el-button> -->
      </el-row>
      <!-- ***************************** -->
      <div style="width: 100%; height: calc(100% - 40px)" ref="flowarea"></div>
      <!-- ***************************** -->
    </div>
    <!-- ***************************** -->
    <div v-show="currentFactory" style="box-sizing: border-box; width: 250px; height: 100%; float: left">
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

import funcNormalDebugNode from '@behaviorEngine/flowDesigner/flowNodes/funcNormalNode'
import onParamJudeDebugNode from '@behaviorEngine/flowDesigner/flowNodes/onParamJudeNode'
import paramNode from '@behaviorEngine/flowDesigner/flowNodes/paramNode'

import defaultEdge from '@behaviorEngine/flowDesigner/flowEdges/defaultEdge'

import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { factory } from '@design-any/interface/dist/bahaviorEngine/actionFactory'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import platform from '@design-any/interface/dist/enums/platform'
import { initNewFactory, excuteFactoryNext, keepFactory, excuteFactoryReDo } from '@common/apis/workflowApi'

@Options({
  components: { flowNodeDebuggerInfo }
})
export default class flowDebugger extends ComponentBase {
  private currentFlow: LogicFlow = null
  private currentFactory: factory = null
  //工厂Id,后端工厂的唯一id。只有调试后端工厂时会有用
  private currentFactoryServerId: string = null
  private orginBehav: behavior = null
  private currentSelected: NodeConfig | EdgeConfig = null

  private get currentPlatform(): platform {
    return this.orginBehav ? this.orginBehav.platform : null
  }

  mounted() {}
  unmounted() {
    this.clearkeepServerFactory()
  }
  // ********初始化**************************************
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
    if (this.currentFlow) {
      this.currentFlow.clearData()
      this.currentFlow = null
    }
    if (!behav) {
      this.orginBehav = null
      this.currentFactory = null
      this.currentSelected = null
      ;(this.$refs.flowNodeDebuggerInfo as flowNodeDebuggerInfo).startDebugger(this.currentFactory)
      return
    }
    this.orginBehav = deepClone(behav)
    behaviorContext.currentDesignPage = currentPage
    // **********************************************
    for (let index = 0; index < behav.actObjs.length; index++) {
      const actObj = behav.actObjs[index]
      let findFlowNode = behav.flowData.nodes.find((o) => o.id === actObj.id)
      findFlowNode.properties.actObj = actObj
    }
    // **********************************************
    if (this.currentPlatform === platform.server) {
      await this.createFactory_server(behav)
    } else {
      await this.createFactory_web(behav, currentPage)
    }
    // **********************************************
    this.createFlowmap(behav)
  }
  //创建工厂，前端运行的
  private async createFactory_web(behav: behavior, currentPage: EnginePage) {
    this.currentFactory = new factory(currentPage, currentPage, behav)
    ;(this.$refs.flowNodeDebuggerInfo as flowNodeDebuggerInfo).startDebugger(this.currentFactory)
  }
  //创建工厂，后端运行的，用于自定义api
  private async createFactory_server(behav: behavior) {
    this.currentFactoryServerId = await initNewFactory(behav.id)
    this.keepServerFactory()
    this.currentFactory = new factory(null, null, behav)
    ;(this.$refs.flowNodeDebuggerInfo as flowNodeDebuggerInfo).startDebugger(this.currentFactory)
  }

  private keepServerFactoryInter: number = -1
  private keepServerFactory() {
    this.keepServerFactoryInter = window.setInterval(async () => {
      await keepFactory(this.currentFactoryServerId)
    }, 10000) // 每10秒钟保持一次连接
  }

  private clearkeepServerFactory() {
    if (this.keepServerFactoryInter !== -1) {
      window.clearInterval(this.keepServerFactoryInter)
      this.keepServerFactoryInter = -1
    }
  }

  private createFlowmap(behav: behavior) {
    let flowdata = behav.flowData
    // **********清除行为运行状态******************
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
            callback: () => {}
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
    this.currentFlow.register(paramNode)

    this.currentFlow.register(defaultEdge)
    //
    this.currentFlow.setDefaultEdgeType('defaultEdge')
    this.currentFlow.on('node:click', this.onNodeClick)
    this.currentFlow.on('edge:click', this.onEdgeClick)

    this.currentFlow.render(flowdata)
    this.currentFlow.translateCenter()
    this.onFlowCreated(this.currentFlow)
    this.clearNoUseEdge(this.currentFlow)
    this.setNodesDebugging(this.currentFlow)
  }

  private setNodesDebugging(flow: LogicFlow) {
    let allnodes = flow.getGraphRawData().nodes
    for (let index = 0; index < allnodes.length; index++) {
      const node = allnodes[index]
      const sourceNodeModel = flow.getNodeModelById(node.id)
      sourceNodeModel.setIsDebugging(true)
    }
  }

  //清除无效连线
  private clearNoUseEdge(flow: LogicFlow) {
    let alledges = flow.getGraphRawData().edges
    for (let index = 0; index < alledges.length; index++) {
      const edge = alledges[index]
      const sourceNodeModel = flow.getNodeModelById(edge.sourceNodeId)
      const sourceAnchor = sourceNodeModel?.getDefaultAnchor().find((anchor) => anchor.id === edge.sourceAnchorId)
      const targetNodeModel = flow.getNodeModelById(edge.targetNodeId)
      const targetAnchor = targetNodeModel?.getDefaultAnchor().find((anchor) => anchor.id === edge.targetAnchorId)

      if (!sourceAnchor || !targetAnchor) {
        flow.deleteEdge(edge.id)
      }
    }
  }

  @Emit('onFlowCreated')
  private onFlowCreated(flow) {}
  // ***********调试功能**************************
  private async nextStep() {
    if (!this.currentFactory) {
      return
    }

    let actobjs: actionObj[] = []
    if (this.currentPlatform === platform.server) {
      actobjs = await excuteFactoryNext(this.currentFactoryServerId)
    } else {
      actobjs = await this.currentFactory.excuteNextStep()
    }

    try {
      for (let index = 0; index < actobjs.length; index++) {
        const actobj = actobjs[index]
        let node = this.currentFlow.getNodeModelById(actobj.id)
        node.setActObj(actobj)
      }
    } catch (error) {
      debugger
    }
  }

  private async onReDo() {
    if (this.currentPlatform === platform.server) {
      await excuteFactoryReDo(this.currentFactoryServerId)
    }
    this.setFlowData(this.orginBehav, behaviorContext.currentDesignPage)
  }
  private onNodeClick({ data, e, position }) {
    this.currentSelected = data
  }
  private onEdgeClick({ data, e, position }) {
    this.currentSelected = data
  }
  private editBehaviorClick() {
    this.onEditBehavior(this.orginBehav, this.currentFactory.currentPage)
  }

  @Emit('onEditBehavior')
  private onEditBehavior(beha, page) {}
}
</script>

<style lang="less">
@import '../flowDesigner/flowDesigner.less';
</style>
