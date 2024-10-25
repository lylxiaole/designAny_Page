<template style="height: 100%">
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="Behavior Binding" style="height: 88%" width="95%" v-model="windowVisible" append-to-body :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
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
    <template #footer>
      <el-row class="dialog-footer" style="height: 50px">
        <div class="steps-action">
          <el-button @click="onCancel">Cancel</el-button>
          <el-button :style="{ 'margin-left': '8px' }" type="primary" @click="onConfirm">Sure</el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop, Ref } from 'vue-property-decorator'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import flowDesign from '../behaviorDesigner/flowDesign.vue'
import resourceTree from '../behaviorDesigner/resourceTree.vue'

@Options({
  components: { flowDesign, resourceTree }
})
export default class behaviorSetting extends Vue {
  currentPage: EnginePage = null
  /**当前正在设置的行为 */
  currentSettingBehavior: behavior = null
  // ****************************************************
  private windowVisible: boolean = false
  public async show(behav: behavior, page: EnginePage) {
    this.currentSettingBehavior = behav
    this.currentPage = page
    this.windowVisible = true
    await this.$nextTick()
    ;(this.$refs.flowDesign as flowDesign).setFlowData(behav, page)
    ;(this.$refs.resourceTree as resourceTree).init(page)
  }

  private onClose() {
    this.windowVisible = false
  }
  private onConfirm() {
    let data = (this.$refs.flowDesign as flowDesign).getFlowData()
    this.currentSettingBehavior.actObjs = data.allObjs
    this.currentSettingBehavior.flowData = data.flowData
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }
  // *****************************************************
  private onFlowCreated(flow) {
    ;(this.$refs.resourceTree as resourceTree).setCurrentFlow(flow)
  }
  private onCurrentSelectChanged(nodeOrEndge) {}
  // *****************************************************
}
</script>

<style scoped></style>
