<template>
  <div class="buttons nodrag">
    <button v-for="operator of operators" :key="`${id}-${operator}-operator`" :class="{ selected: nodeData.operator === operator }"
      @click="updateNodeData( id, { operator })">
      <span>{{operator}}</span>
    </button>
  </div>

  <Handle type="source" position="right" :connectable="true" />
  <Handle id="target-a" type="target" position="left" :connectable="true" />
  <Handle id="target-b" type="target" position="left" :connectable="true" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
@Options({
  components: {
    Handle
  }
})
export default class methodInPageNode extends Vue {
  @Prop()
  private id: any

  @Prop()
  private nodeData: any

  private updateNodeData: any = useVueFlow()
  private operators: any[] = ['+', '-', '*', '/']
}
</script>


<style lang="less" scoped>
</style>