<template>
  <el-row>
    <el-col style="width:150px">
      <el-button class="button" size="mini" @click="startChooseFlowmeter">选择流量计</el-button>
      <chooseFlowmeter :dialogVisible="chooseFlowmeterVisible" @onSure="onChooseFlowmeter" @onCancel="onCancelChooseFlometer" />
    </el-col>
    <el-col style="width:calc(100% - 400px);display:flex;flex-wrap:wrap">
      <span class="label">位号:FT-3001</span>
      <span class="label">投用状态:投用</span>
      <span class="label">厂家:艾默生</span>
      <span class="label">区域:油品作业区</span>
      <span class="label">计量表:93汽油进料</span>
      <span class="label">类型:质量流量计</span>
      <span class="label">状态:正常</span>
    </el-col>
    <el-col style="width:250px">
      <el-row>
        <el-button class="button" size="mini" @click="openAlarmInfo">查看流量计报警</el-button>
        <el-button class="button" size="mini" @click="openFlowmeterHis">查看流量计历史</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk } from '../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import chooseFlowmeter from './chooseFlowmeter/index.vue'
// *****************************************************************
/*** */
@Component({
  components: {
    chooseFlowmeter
  }
})
export default class flowmeterHeader extends ComponentBase {
  @Prop({
    default: () => {
      return ''
    }
  })
  flowmeterCode: string
  @Emit('update:flowmeterCode')
  private updateValue_flowmeterCode(val: boolean) {}
  // ********************************************************************************
  mounted() {
    this.loadData()
  }
  // ***************加载当前流量计数据 *********************************************
  private async loadData() {}
  // ******************choose flowmeter**************************************************************
  private chooseFlowmeterVisible: boolean = false
  private startChooseFlowmeter() {
    this.chooseFlowmeterVisible = true
  }

  private async onChooseFlowmeter(data: any) {
    window.console.log('onChooseFlowmeter:', data)
    this.loadData()
  }
  private async onCancelChooseFlometer() {}
  // *****************************************************************************
  private async openAlarmInfo() {
    this.$router.push({ path: '/flowmeterAlarm', query: { code: this.flowmeterCode } })
  }
  private async openFlowmeterHis() {
    this.$router.push({ path: '/historyData', query: { code: this.flowmeterCode } })
  }
}
</script>
<style lang="less" scoped>
.label {
  margin-left: 25px;
}
</style>
