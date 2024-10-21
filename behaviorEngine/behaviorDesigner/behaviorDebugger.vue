<template style="height: 100%">
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="Behavior Binding" style="height: 88%" width="95%" v-model="windowVisible" append-to-body :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row style="height: calc(100% - 50px); width: 100%; background: #fff">
      <div style="width: calc(100% - 250px); float: left; box-sizing: border-box">
        <!-- 流程图 -->
        <flowDebugger ref="flowDebugger" />
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
import flowDebugger from '../flowDesigner/debugger/flowDebugger.vue'
import behaviorContext from '@behaviorEngine/01designerContext/context'

@Options({
  components: { flowDebugger }
})
export default class behaviorDebugger extends Vue {
  currentPage: EnginePage = null
  /**当前正在设置的行为 */
  currentSettingBehavior: behavior = null
  // ****************************************************
  private windowVisible: boolean = false
  public async show(behav: behavior, page: EnginePage) {
    this.currentSettingBehavior = behav
    this.currentPage = page
    behaviorContext.currentDesignPage = page
    this.windowVisible = true
    await this.$nextTick()
    ;(this.$refs.flowDebugger as flowDebugger).setFlowData(behav.flowData)
  }

  private onClose() {
    this.windowVisible = false
  }
  private onConfirm() {
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }
}
</script>

<style scoped></style>
