<template>
  <div style="height:100%;width:100%">
    <el-row style="height:100%">
      <el-col :span="12">
        <el-row><span>位号:xxxx</span></el-row>
        <el-row><span>产商:xxxx</span></el-row>
        <el-row><span>计量表:xxxx</span></el-row>
        <el-row>
          <el-button class="button" size="mini" @click="chooseFirstFlowmeter">选择流量计</el-button>
        </el-row>
        <chooseFlowmeter :dialogVisible.sync="chooseFlowmeterVisible" @onSure="onChooseFlowmeter1" @onCancel="onCancelChooseFlometer1" />
      </el-col>
      <el-col :span="12">
        <el-row><span>位号:xxxx</span></el-row>
        <el-row><span>产商:xxxx</span></el-row>
        <el-row><span>计量表:xxxx</span></el-row>
        <el-row>
          <el-button class="button" size="mini" @click="chooseSecondFlowmeter">选择流量计</el-button>
        </el-row>
        <chooseFlowmeter :dialogVisible.sync="chooseFlowmeterVisible" @onSure="onChooseFlowmeter2" @onCancel="onCancelChooseFlometer2" />
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
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {}
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
  private async chooseFirstFlowmeter() {}
  private async chooseSecondFlowmeter() {}
  // ************************************************************
  private async onChooseFlowmeter1(data: any) {
    this.updateValue_firstFlowmeter(data)
  }
  private async onCancelChooseFlometer1() {}
  private async onChooseFlowmeter2(data: any) {
    this.updateValue_secondFlowmeter(data)
  }
  private async onCancelChooseFlometer2() {}
}
</script>
<style scoped>
</style>
