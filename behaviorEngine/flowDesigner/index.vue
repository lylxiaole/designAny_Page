<template>
  <div @drop="onDrop" style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <VueFlow ref="flow" v-model="nodes" v-model:edges="edges" @connect="handleConnectLine" @dragover="onDragOver" @dragleave="onDragLeave">
      <template #node-methodInPage="props">
        <methodInPageNode :id="props.id" :nodeData="props.data"></methodInPageNode>
      </template>

    </VueFlow>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { VueFlow, VueFlowError } from '@vue-flow/core'

import { getUuid } from '@common/utils'

import methodInPageNode from './flowNodes/methodInPageNode.vue'

@Options({
  components: {
    VueFlow,
    methodInPageNode
  }
})
export default class index extends ComponentBase {
  private nodes: any[] = []
  private edges: any[] = []

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
  private draggedType: string = 'methodInPage'
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

<style lang="less"  >
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

html,
body,
#app {
  margin: 0;
  height: 100%;
}

#app {
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.math-flow {
  background-color: #edf2f7;
  height: 100%;
  width: 100%;
}

.vue-flow__handle {
  height: 24px;
  width: 10px;
  background: #aaa;
  border-radius: 4px;
}

.vue-flow__edges path {
  stroke-width: 3;
}

.vue-flow__node {
  background-color: #f3f4f6;
}

.vue-flow__node-value {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px #0003;
}

.vue-flow__node-value.selected {
  box-shadow: 0 0 0 2px #ec4899;
}

.vue-flow__node-value input {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 10px #0000001a;
}

.vue-flow__node-value input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ec4899;
  transition: box-shadow 0.2s;
}

.vue-flow__node-value .vue-flow__handle {
  background-color: #ec4899;
}

.vue-flow__node-methodInPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 0 10px #0003;
}

.vue-flow__node-methodInPage.selected {
  box-shadow: 0 0 0 2px #2563eb;
}

.vue-flow__node-methodInPage .buttons {
  display: flex;
  gap: 8px;
}

.vue-flow__node-methodInPage button {
  border: none;
  cursor: pointer;
  background-color: #4a5568;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 0 10px #0000004d;
  width: 40px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vue-flow__node-methodInPage button svg {
  width: 100%;
  height: 100%;
}

.vue-flow__node-methodInPage button:hover {
  background-color: #2563eb;
  transition: background-color 0.2s;
}

.vue-flow__node-methodInPage button.selected {
  background-color: #2563eb;
}

.vue-flow__node-methodInPage .vue-flow__handle[data-handleid='target-a'] {
  top: 25%;
}

.vue-flow__node-methodInPage .vue-flow__handle[data-handleid='target-b'] {
  top: 75%;
}

.vue-flow__node-methodInPage .vue-flow__handle {
  background-color: #2563eb;
}

.vue-flow__node-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 0 10px #0003;
}

.vue-flow__node-result.selected {
  box-shadow: 0 0 0 2px #5ec697;
}

.vue-flow__node-result .result {
  display: flex;
  gap: 8px;
  font-size: 24px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>