<template>
  <el-dialog title="提示" :show-close="false" :visible.sync="dialogVisible" width="70%" center>
    <div style="height:500px;width:100%">
      <!-- *********stepContent******************************* -->
      <el-row style="height:400px">
        <chooseFlowmeter v-if="step===1" :firstFlowmeter.sync="firstFlowmeter" :secondFlowmeter.sync="secondFlowmeter" />
        <choosePamaters v-if="step===2" :firstChooseParams="firstParams" :secondChooseParams="secondParams" />
      </el-row>
      <!-- *********steps******************************* -->
      <el-row style="height:80px">
        <el-steps :active="step" align-center>
          <el-step title="步骤1" description="选择流量计"></el-step>
          <el-step title="步骤2" description="选择流量计参数"></el-step>
        </el-steps>
      </el-row>
    </div>
    <!-- *********footer******************************* -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancelChoose">取 消</el-button>
      <el-button v-if="step===2" @click="preStep">上一步</el-button>
      <el-button v-if="step===1&&canStep2" @click="nextStep">下一步</el-button>
      <el-button v-if="step===2&&canSure" type="primary" @click="onSureChoose">确 定</el-button>
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
  private dialogVisible: boolean = false
  private step: number = 1
  ////////////////
  private firstFlowmeter: any = null
  private secondFlowmeter: any = null
  private get canStep2(): boolean {
    if (this.firstFlowmeter && this.secondFlowmeter) {
      return true
    }
    return false
  }
  ////////////////
  private firstParams: any = null
  private secondParams: any = null
  private get canSure(): boolean {
    if (this.firstParams && this.secondParams) {
      return true
    }
    return false
  }
  // ********************************************************************************
  mounted() {}
  // ********************************************************************************
  private async nextStep() {
    this.step = 2
  }
  private async preStep() {
    this.step = 1
  }
  private async onSureChoose() {
    this.dialogVisible = false
    this.onSure({})
  }
  private async onCancelChoose() {
    this.dialogVisible = false
    this.onCancel()
  }
  // ********************************************************************************
  public async showChooseFlowmeter(firstFlowmeter: any, secondFlowmeter: any) {
    this.step = 1
    this.dialogVisible = true
  }
  public async showChooseParams(firstFlowmeter: any, firstParams: any, secondFlowmeter: any, secondParams: any) {
    this.step = 2
    this.dialogVisible = true
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
