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
import funcNormalNode from './funcNormalNode'

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
    this.currentFlow.render(this.flowdata)
    this.currentFlow.translateCenter()
  }

  // ****************拖拽******************************
  private isDragOver: boolean = false
  private onDrop(event) {
    if (!event.dataTransfer) {
      return
    }

    let data = event.dataTransfer.getData('application/vueflow')
    let actObj = JSON.parse(data) as objectBase
    this.currentFlow.addNode({
      id: actObj.id,
      type: actObj.funcCode,
      x: 0,
      y: 0,
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
}
</script>

<style lang="less"   >
@import './flowDesigner.less';
</style>./methodInPageNode