<template>
  <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <div ref="flowarea"></div>
    <TeleportContainer />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { getUuid } from '@common/utils'

import { Graph } from '@antv/x6'

import methodInPageNode from './flowNodes/methodInPageNode.vue'
import { register, getTeleport } from '@antv/x6-vue-shape'

register({
  shape: 'methodInPageNode',
  width: 100,
  height: 100,
  component: methodInPageNode
})
const TeleportContainer = getTeleport()

@Options({
  components: { TeleportContainer }
})
export default class index extends ComponentBase {
  private currentFlow: Graph
  private flowdata: any = {
    nodes: [
      {
        id: 'node1',
        shape: 'methodInPageNode',
        x: 40,
        y: 40,
        width: 100,
        height: 40,
        label: 'hello',
        attrs: {
          // body 是选择器名称，选中的是 rect 元素
          body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6
          }
        }
      },
      {
        id: 'node2',
        shape: 'rect',
        x: 160,
        y: 180,
        width: 100,
        height: 40,
        label: 'world',
        attrs: {
          body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6
          }
        }
      }
    ],
    edges: [
      {
        shape: 'edge',
        source: 'node1',
        target: 'node2',
        label: 'x6',
        attrs: {
          // line 是选择器名称，选中的边的 path 元素
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1
          }
        }
      }
    ]
  }

  mounted() {
    this.drawFlow()
  }
  private async drawFlow() {
    await this.$nextTick()
    this.currentFlow = new Graph({
      container: this.$refs.flowarea as any,
      width: 800,
      height: 600,
      background: {
        color: '#F2F7FA'
      },
      autoResize: true,
      panning: true,
      mousewheel: true
    })
    this.currentFlow.fromJSON(this.flowdata)
    this.currentFlow.centerContent()
  }

  // ****************连线******************************
}
</script>

<style lang="less"  >
</style>