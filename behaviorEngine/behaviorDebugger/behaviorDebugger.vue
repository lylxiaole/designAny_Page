<template>
  <el-row style="width: 100%; height: 100%">
    <div style="height: 100%; float: left" :style="{width:currentPlatform==='server'?'0px':'220px'}">
      <behaviorList :currentPage="currentPage" @onBehaviorChanged="onBehaviorChanged" />
    </div>
    <div style="height: 100%; float: left" :style="{width:currentPlatform==='server'?'100%':' calc(100% - 220px)'}">
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
import { EnginePage, EngineContainer } from '@design-any/interface/dist/LayoutInterface'
import platform from '@design-any/interface/dist/enums/platform'

@Options({
  components: { behaviorList, flowDebugger }
})
export default class behaviorDebugger extends ComponentBase {
  currentPage: EnginePage = null
  currentBehavior: behavior = null
  private get currentPlatform(): platform {
    return this.currentBehavior ? this.currentBehavior.platform : platform.page
  }

  public async setFlowData(behav: behavior, currentPage: EnginePage) {
    this.currentBehavior = behav
    this.currentPage = currentPage
    if (this.$refs.flowDebugger) {
      await (this.$refs.flowDebugger as flowDebugger).setFlowData(behav, currentPage)
    }
  }

  private async onBehaviorChanged(behav: behavior, container: EngineContainer) {
    await this.setFlowData(behav, container as any)
  }

  @Emit('onEditBehavior')
  private onEditBehavior(beha) {}
}
</script>

<style lang="less"></style>
