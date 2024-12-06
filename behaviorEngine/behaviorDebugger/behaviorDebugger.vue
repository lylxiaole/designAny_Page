<template>
  <el-row style="width: 100%; height: 100%">
    <div style="width: 220px; height: 100%; float: left">
      <behaviorList :currentPage="currentPage" @onBehaviorChanged="onBehaviorChanged" />
    </div>
    <div style="width: calc(100% - 220px); height: 100%; float: left">
      <flowDebugger ref="flowDebugger" @onEditBehavior="onEditBehavior" />
    </div>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'

import behaviorList from './behaviorList.vue'
import flowDebugger from './flowDebugger.vue'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'

@Options({
  components: { behaviorList, flowDebugger }
})
export default class behaviorDebugger extends ComponentBase {
  @Prop({
    default: () => {
      return null
    }
  })
  currentPage: EnginePage

  public async setFlowData(behav: behavior, currentPage: EnginePage) {
    if (this.$refs.flowDebugger) {
      await (this.$refs.flowDebugger as behaviorDebugger).setFlowData(behav, currentPage)
    }
  }

  private async onBehaviorChanged(behav: behavior) {
    await this.setFlowData(behav, this.currentPage)
  }

  @Emit('onEditBehavior')
  private onEditBehavior(beha) {}
}
</script>

<style lang="less"></style>
