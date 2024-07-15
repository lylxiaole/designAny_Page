<template>
  <div @drop="onDrop" style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <VueFlow ref="flow" v-model="nodes" v-model:edges="edges" @connect="handleConnectLine" @dragover="onDragOver" @dragleave="onDragLeave">
    </VueFlow>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { VueFlow, VueFlowError } from '@vue-flow/core'
import { getUuid } from '@common/utils'

@Options({
  components: {
    VueFlow
  }
})
export default class index extends ComponentBase {
  // @Prop({ default: null })
  // private currentApiContent: ApiContentDC

  private nodes: any[] = [
    // // an input node, specified by using `type: 'input'`
    // {
    //   id: '1',
    //   type: 'input',
    //   position: { x: 250, y: 5 },
    //   // all nodes can have a data object containing any data you want to pass to the node
    //   // a label can property can be used for default nodes
    //   data: { label: 'Node 1' }
    // },
    // // default node, you can omit `type: 'default'` as it's the fallback type
    // {
    //   id: '2',
    //   position: { x: 100, y: 100 },
    //   data: { label: 'Node 2' }
    // },
    // // An output node, specified by using `type: 'output'`
    // {
    //   id: '3',
    //   type: 'output',
    //   position: { x: 400, y: 200 },
    //   data: { label: 'Node 3' }
    // },
    // // this is a custom node
    // // we set it by using a custom type name we choose, in this example `special`
    // // the name can be freely chosen, there are no restrictions as long as it's a string
    // {
    //   id: '4',
    //   type: 'special', // <-- this is the custom node type name
    //   position: { x: 400, y: 200 },
    //   data: {
    //     label: 'Node 4',
    //     hello: 'world'
    //   }
    // }
  ]
  private edges: any[] = [
    // // default bezier edge
    // // consists of an edge id, source node id and target node id
    // {
    //   id: 'e1->2',
    //   source: '1',
    //   target: '2',
    //   type: 'step'
    // },
    // // set `animated: true` to create an animated edge path
    // {
    //   id: 'e2->3',
    //   source: '2',
    //   target: '3',
    //   type: 'step',
    //   animated: true
    // },
    // // a custom edge, specified by using a custom type name
    // // we choose `type: 'special'` for this example
    // {
    //   id: 'e3->4',
    //   type: 'special',
    //   source: '3',
    //   target: '4',
    //   // all edges can have a data object containing any data you want to pass to the edge
    //   data: {
    //     hello: 'world'
    //   }
    // }
  ]

  @Watch('edges', { deep: true, immediate: true })
  private onEdgesChanged(val) {}

  @Watch('nodes', { deep: true, immediate: true })
  private onNodesChanged(val) {}

  mounted() {}
  // ****************连线******************************
  private handleConnectLine(params) {
    ;(this.$refs.flow as any).addEdges([params])
  }
  // ****************拖拽******************************
  private draggedType: string = 'output'
  private isDragOver: boolean = false
  private isDragging: boolean = false

  private onDragStart(event, type) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    this.draggedType = type
    this.isDragging = true

    document.addEventListener('drop', this.onDragEnd)
  }

  /**
   * Handles the drag over event.
   *
   * @param {DragEvent} event
   */
  private onDragOver(event) {
    event.preventDefault()

    if (this.draggedType) {
      this.isDragOver = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  private onDragLeave() {
    this.isDragOver = false
  }

  private onDragEnd() {
    this.isDragging = false
    this.isDragOver = false
    this.draggedType = null
    document.removeEventListener('drop', this.onDragEnd)
  }

  /**
   * Handles the drop event.
   *
   * @param {DragEvent} event
   */
  private onDrop(event) {
    const position = (this.$refs.flow as any).screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY
    })

    const nodeId = getUuid()

    const newNode = {
      id: nodeId,
      type: this.draggedType,
      position,
      data: { label: nodeId }
    }

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = (this.$refs.flow as any).onNodesInitialized(() => {
      ;(this.$refs.flow as any).updateNode(nodeId, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
      }))
      off()
    })

    ;(this.$refs.flow as any).addNodes(newNode)
  }
}
</script>

<style>
</style>