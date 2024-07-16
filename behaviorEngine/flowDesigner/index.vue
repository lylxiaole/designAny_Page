<template>
  <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <div ref="flowarea"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { getUuid } from '@common/utils'
import methodInPageNode from './flowNodes/methodInPageNode'

import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'

@Options({
  components: {}
})
export default class index extends ComponentBase {
  private currentFlow: LogicFlow
  private flowdata: any = {
    nodes: [
      {
        id: '1',
        type: 'methodInPageNode',
        x: 100,
        y: 100,
        text: '节点1'
      },
      {
        id: '2',
        type: 'circle',
        x: 150,
        y: 100,
        text: '节点2'
      }
    ],
    edges: [
      {
        sourceNodeId: '1',
        targetNodeId: '2',
        type: 'polyline',
        text: '连线',
        startPoint: {
          x: 140,
          y: 100
        },
        endPoint: {
          x: 250,
          y: 100
        }
      }
    ]
  }
  private silentConfig = {
    isSilentMode: true,
    stopScrollGraph: true,
    stopMoveGraph: true,
    stopZoomGraph: true,
    adjustNodePosition: true
  }

  mounted() {
    window.setTimeout(() => {
      this.drawFlow()
    }, 3000)
  }
  private async drawFlow() {
    await this.$nextTick()
    this.currentFlow = new LogicFlow({
      container: this.$refs.flowarea as HTMLElement,
      grid: true,
      ...this.silentConfig
    })

    this.currentFlow.register(methodInPageNode)
    this.currentFlow.render(this.flowdata)
    this.currentFlow.translateCenter()
  }

  // ****************连线******************************
}
</script>

<style lang="less"  >
</style>