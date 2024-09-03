<template style="height:100%">
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="行为绑定" style="height:600px" width="800px" v-model="windowVisible" append-to-body
    :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row style="height:calc(100% - 50px);background:#FFF;">
      <el-col :span="6" style="border-right:1px solid #cdcdcd">
        <!-- //资源列表 -->
        <resource-tree ref="resourceTree" />
      </el-col>
      <el-col :span="18" style="border-right:1px solid #cdcdcd">
        <!-- 流程图 -->
        <flowDesign ref="flowDesign" @onFlowCreated="onFlowCreated" />
      </el-col>
    </el-row>
    <template #footer>
      <el-row class="dialog-footer" style="height:50px">
        <div class="steps-action">
          <el-button @click="onCancel">
            取消
          </el-button>
          <el-button :style="{'margin-left':'8px'}" type="primary" @click="onConfirm">
            确认
          </el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ref, toRaw } from '@vue/reactivity'
import { Component, Emit, Watch, Prop, Ref } from 'vue-property-decorator'

import { behavior } from '@design-any/interface/bahaviorEngine/behavior'

import { EnginePage } from '@design-any/interface/LayoutInterface'

import flowDesign from '../flowDesigner/flowDesign.vue'
import resourceTree from '../flowDesigner/resourceTree.vue'
import behaviorContext from '@behaviorEngine/01designerContext/context'

@Options({
  components: { flowDesign, resourceTree }
})
export default class behaviorDeatilSetting extends Vue {
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
    ;(this.$refs.flowDesign as flowDesign).setFlowData(behav.flowData)
    ;(this.$refs.resourceTree as resourceTree).init(page)
  }

  private onFlowCreated(flow) {
    ;(this.$refs.resourceTree as resourceTree).setCurrentFlow(flow)
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
}
</script>

<style scoped>
</style>