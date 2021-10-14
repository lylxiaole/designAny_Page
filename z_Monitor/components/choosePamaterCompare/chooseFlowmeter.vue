<template>
  <div style="height:100%;width:100%">
    <el-row style="height:100%">
      <el-col :span="12">
        <el-row><span>位号:{{firstFlowmeter?firstFlowmeter.WEIHAO:''}}</span></el-row>
        <el-row><span>产商:{{firstFlowmeter?firstFlowmeter.JLBCJMC:''}}</span></el-row>
        <el-row><span>计量表:{{firstFlowmeter?firstFlowmeter.JLBMC:''}}</span></el-row>
        <el-row>
          <el-button class="button" size="mini" @click="chooseFirstFlowmeter">选择流量计</el-button>
        </el-row>
        <chooseFlowmeterDialog ref="chooseFlowmeter1" @onSure="onChooseFlowmeter1" @onCancel="onCancelChooseFlometer1" />
      </el-col>
      <el-col :span="12">
        <el-row><span>位号:{{secondFlowmeter?firstFlowmeter.WEIHAO:''}}</span></el-row>
        <el-row><span>产商:{{secondFlowmeter?firstFlowmeter.JLBCJMC:''}}</span></el-row>
        <el-row><span>计量表:{{secondFlowmeter?firstFlowmeter.JLBMC:''}}</span></el-row>
        <el-row>
          <el-button class="button" size="mini" @click="chooseSecondFlowmeter">选择流量计</el-button>
        </el-row>
        <chooseFlowmeterDialog ref="chooseFlowmeter2" @onSure="onChooseFlowmeter2" @onCancel="onCancelChooseFlometer2" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/PageBase'
import { jkzl, jlbjk } from '../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import chooseFlowmeterDialog from '../chooseFlowmeter/index.vue'
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {
    chooseFlowmeterDialog
  }
})
export default class chooseFlowmeter extends ComponentBase {
  @Prop({
    default: () => {
      return null
    }
  })
  private firstFlowmeter: any
  @Emit('update:firstFlowmeter')
  private updateValue_firstFlowmeter(val: boolean) {}

  @Prop({
    default: () => {
      return null
    }
  })
  private secondFlowmeter: any
  @Emit('update:secondFlowmeter')
  private updateValue_secondFlowmeter(val: boolean) {}
  // ********************************************************************************
  mounted() {}
  // ************************************************************
  private async chooseFirstFlowmeter() {
    ;(this.$refs.chooseFlowmeter1 as chooseFlowmeterDialog).chooseFlowmeter()
  }
  private async chooseSecondFlowmeter() {
    ;(this.$refs.chooseFlowmeter2 as chooseFlowmeterDialog).chooseFlowmeter()
  }
  // ************************************************************
  private async onChooseFlowmeter1(data: any) {
    window.console.log('onChooseFlowmeter1:', data)
    this.updateValue_firstFlowmeter(data)
  }
  private async onCancelChooseFlometer1() {}
  private async onChooseFlowmeter2(data: any) {
    window.console.log('onChooseFlowmeter2:', data)
    this.updateValue_secondFlowmeter(data)
  }
  private async onCancelChooseFlometer2() {}
}
</script>
<style scoped>
</style>
