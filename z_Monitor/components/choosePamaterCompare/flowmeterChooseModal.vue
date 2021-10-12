<template>
  <el-dialog title="提示" :show-close="false"  :visible.sync="dialogVisible" width="370%" center>
    <div style="height:100%;width:100%">
      <!-- *********stepContent******************************* -->
      <div></div>
      <!-- *********steps******************************* -->
      <el-steps :active="2" align-center>
        <el-step title="步骤1" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="步骤3" description="这是一段很长很长很长的描述性文字"></el-step>
      </el-steps>
    </div>
    <!-- *********footer******************************* -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancelChoose">取 消</el-button>
      <el-button type="primary" @click="onSureChoose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { Route } from 'vue-router'
import chooseFlowmeter from './chooseFlowmeter.vue'
import choosePamaters from './choosePamaters.vue'

// *****************************************************************
/***流量计数据对比 */
@Component({
  components: { chooseFlowmeter, choosePamaters }
})
export default class flowmeterChooseModal extends ComponentBase {
  @Prop({
    default: () => {
      return false
    }
  })
  private dialogVisible: boolean
  @Emit('update:dialogVisible')
  private updateValue_dialogVisible(val: boolean) {}

  // ********************************************************************************
  mounted() {}
  // ********************************************************************************

  private async onSureChoose() {
    this.onSure({})
    this.updateValue_dialogVisible(false)
  }
  private async onCancelChoose() {
    this.onCancel()
    this.updateValue_dialogVisible(false)
  }
  // ************************************************************

  @Emit('onSure')
  private onSure(row: any) {}

  @Emit('onCancel')
  private onCancel() {}
}
</script>
<style scoped>
</style>
