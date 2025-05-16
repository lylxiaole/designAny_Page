<template>
  <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <el-row style="height: calc(100% - 50px); width: 100%; background: #fff">
      <div style="border-right: 1px solid #cdcdcd; width: 250px; float: left; box-sizing: border-box">
        <!-- //资源列表 -->
        <resource-tree ref="resourceTree" />
      </div>
      <!-- ******************************************** -->
      <div style="width: calc(100% - 250px); float: left; box-sizing: border-box">
        <!-- 流程图 -->
        <flowDesign ref="flowDesign" @onFlowCreated="onFlowCreated" @onCurrentSelectChanged="onCurrentSelectChanged" />
      </div>
      <!-- ******************************************** -->
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { ApiContentDC, UpdateSertAPIContent } from '@common/apis/designApi'
import flowDesign from '@behaviorEngine/behaviorDesigner/flowDesign.vue'
import resourceTree from '@behaviorEngine/behaviorDesigner/resourceTree.vue'
import platform from '@design-any/interface/dist/enums/platform'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'

@Options({
  components: { flowDesign, resourceTree }
})
export default class apiDetail extends ComponentBase {
  currentSettingBehavior: behavior = null

  mounted() {}

  public async setCurrentApi(behav: behavior) {
    this.currentSettingBehavior = behav

    await this.$nextTick()
    ;(this.$refs.flowDesign as flowDesign).setFlowData(behav, null)
    ;(this.$refs.resourceTree as resourceTree).init(null, platform.server)
  }

  private onFlowCreated(flow) {
    ;(this.$refs.resourceTree as resourceTree).setCurrentFlow(flow)
  }
  private onCurrentSelectChanged(nodeOrEndge) {}
}
</script>

<style>
.detailrow {
  width: 500px;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>