<template>
  <el-row>
    <el-col style="width:150px">
      <el-button class="button" size="mini" @click="startChooseFlowmeter">选择流量计</el-button>
      <chooseFlowmeter :dialogVisible.sync="chooseFlowmeterVisible" @onSure="onChooseFlowmeter" @onCancel="onCancelChooseFlometer" />
    </el-col>
    <el-col style="width:calc(100% - 600px);display:flex;flex-wrap:wrap">
      <span class="label">位号:&nbsp;{{flowmeterDetail?flowmeterDetail.WEIHAO:''}}</span>
      <span class="label">投用状态:&nbsp;{{flowmeterDetail?(flowmeterDetail.tyztms||flowmeterDetail.TYZTMS):''}}</span>
      <span class="label">厂家:&nbsp;{{flowmeterDetail?flowmeterDetail.JLBCJMC:''}}</span>
      <span class="label">区域:&nbsp;{{flowmeterDetail?flowmeterDetail.QYMC:''}}</span>
      <span class="label">计量表:&nbsp;{{flowmeterDetail?flowmeterDetail.JLBMC:''}}</span>
      <span class="label">类型:&nbsp;{{flowmeterDetail?flowmeterDetail.JLBLXMC:''}}</span>
      <span class="label">状态:&nbsp;{{flowmeterDetail?(flowmeterDetail.zxztms||flowmeterDetail.ZXZTMS):''}}</span>
    </el-col>
    <el-col style="width:450px">
      <el-row>
        <el-button class="button" size="mini" v-if="showBtns.indexOf('detail')>-1" @click="openFlowmeterInfo">查看流量计信息</el-button>
        <el-button class="button" size="mini" v-if="showBtns.indexOf('alarm')>-1" @click="openAlarmInfo">查看流量计报警</el-button>
        <el-button class="button" size="mini" v-if="showBtns.indexOf('history')>-1" @click="openFlowmeterHis">查看流量计历史</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, getFlowmeterDetail } from '../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import chooseFlowmeter from './chooseFlowmeter/index.vue'
import { watch } from 'fs'
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
      return []
    }
  })
  private showBtns: string[]

  @Prop({
    default: () => {
      return null
    }
  })
  private flowmeterDetail: any
  @Emit('update:flowmeterDetail')
  private updateValue_flowmeterDetail(val: boolean) {}
  @Watch('flowmeterDetail')
  private async watchflowmeterDetailChange(val: any) {}
  // ********************************************************************************
  mounted() {}
  // ******************choose flowmeter**************************************************************
  private chooseFlowmeterVisible: boolean = false
  private startChooseFlowmeter() {
    this.chooseFlowmeterVisible = true
  }
  private async onChooseFlowmeter(data: any) {
    if (!data) {
      return
    }
    window.console.log('onChooseFlowmeter:', data)
    this.updateValue_flowmeterDetail(data)
  }
  private async onCancelChooseFlometer() {}
  // *****************************************************************************
  private async openAlarmInfo() {
    this.$router.push({ path: '/flowmeterAlarm', query: { id: this.flowmeterDetail.JLBID } })
  }
  private async openFlowmeterHis() {
    this.$router.push({ path: '/historyData', query: { id: this.flowmeterDetail.JLBID } })
  }
  private async openFlowmeterInfo() {
    this.$router.push({ path: '/flowmeterInfo', query: { id: this.flowmeterDetail.JLBID } })
  }
}
</script>
<style lang="less" scoped>
.label {
  margin-left: 25px;
}
</style>
