<template>
  <el-row class="verticalAlignCenter">
    <el-col :style="{ width: chooseBtnWidth + 'px' }" class="verticalAlignCenter flexHorilanLayout" v-if="showChooseBtn">
      <el-button class="button" type="primary" size="mini" @click="startChooseFlowmeter">选择流量计</el-button>
      <chooseFlowmeter ref="chooseFlowmeter" @onSure="onChooseFlowmeter" @onCancel="onCancelChooseFlometer" />
    </el-col>
    <el-col :style="{ width: middleWith }" style="position: relative">
      <span class="label">位号：{{ flowmeterDetail ? flowmeterDetail.WEIHAO : "" }}</span>
      <span class="label">投用状态：{{
          flowmeterDetail
            ? flowmeterDetail.tyztms || flowmeterDetail.TYZTMS
            : ""
        }}</span>
      <span class="label">厂家：{{ flowmeterDetail ? flowmeterDetail.JLBCJMC : "" }}</span>
      <span class="label">区域：{{ flowmeterDetail ? flowmeterDetail.QYMC : "" }}</span>
      <span class="label">计量表：{{ flowmeterDetail ? flowmeterDetail.JLBMC : "" }}</span>
      <span class="label">类型：{{ flowmeterDetail ? flowmeterDetail.JLBLXMC : "" }}</span>
      <span class="label">状态：{{
          flowmeterDetail
            ? flowmeterDetail.zxztms || flowmeterDetail.ZXZTMS
            : ""
        }}</span>
      <el-image style="width: 16px; height: 16px;margin-left:20px;margin-top:2px;float:left" :src="imgUrl" fit="contain"></el-image>
    </el-col>
    <el-col :style="{ width: leaderBtnWidth + 'px' }">
      <el-row class="verticalAlignCenter flexHorilanLayout">
        <el-button class="button" type="primary" size="mini" v-if="showBtns.indexOf('detail') > -1" @click="openFlowmeterInfo">查看流量计信息</el-button>
        <el-button class="button" type="primary" size="mini" v-if="showBtns.indexOf('alarm') > -1" @click="openAlarmInfo">查看流量计报警</el-button>
        <el-button class="button" type="primary" size="mini" v-if="showBtns.indexOf('history') > -1" @click="openFlowmeterHis">查看流量计历史</el-button>
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
var zcIcon = require('../assets/areaMap/zc.png')
var xxIcon = require('../assets/areaMap/xx.png')
var wscIcon = require('../assets/areaMap/wsc.png')
var txsbIcon = require('../assets/areaMap/txsb.png')
var jztxIcon = require('../assets/areaMap/jztx.png')
var gzIcon = require('../assets/areaMap/gz.png')
var csjwcIcon = require('../assets/areaMap/csjwc.png')
var cjycIcon = require('../assets/areaMap/cjyc.png')
@Component({
  components: {
    chooseFlowmeter
  }
})
export default class flowmeterHeader extends ComponentBase {
  @Prop({
    default: () => {
      return true
    }
  })
  private showChooseBtn: boolean
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

  private get chooseBtnWidth(): number {
    if (this.showChooseBtn) {
      return 150
    } else {
      return 0
    }
  }

  private get leaderBtnWidth(): number {
    return this.showBtns.length * 140
  }

  private get middleWith(): string {
    return `calc(100% - ${this.chooseBtnWidth + this.leaderBtnWidth}px)`
  }

  private get imgUrl() {
    if (!this.flowmeterDetail) {
      return '../assets/areaMap/zc.png'
    }
    switch (this.flowmeterDetail.ZXZT) {
      case '0':
        return zcIcon
        break
      case '1':
        return xxIcon
        break
      case '2':
        return gzIcon
        break
      case '3':
        return cjycIcon
        break
      case '4':
        return csjwcIcon
        break
      case '5':
        return jztxIcon
        break
      case '6':
        return txsbIcon
        break
      case '8':
        return wscIcon
        break
    }
  }
  // ********************************************************************************
  mounted() {}
  // ******************choose flowmeter**************************************************************
  private startChooseFlowmeter() {
    ;(this.$refs.chooseFlowmeter as chooseFlowmeter).chooseFlowmeter()
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
    let flowmeterId = this.flowmeterDetail ? this.flowmeterDetail.JLBID : null
    if (flowmeterId) {
      this.$router.push({
        path: '/flowmeterAlarm',
        query: { id: flowmeterId }
      })
    } else {
      this.$router.push({ path: '/flowmeterAlarm' })
    }
  }
  private async openFlowmeterHis() {
    let flowmeterId = this.flowmeterDetail ? this.flowmeterDetail.JLBID : null
    if (flowmeterId) {
      this.$router.push({ path: '/historyData', query: { id: flowmeterId } })
    } else {
      this.$router.push({ path: '/historyData' })
    }
  }
  private async openFlowmeterInfo() {
    let flowmeterId = this.flowmeterDetail ? this.flowmeterDetail.JLBID : null
    if (flowmeterId) {
      this.$router.push({ path: '/flowmeterInfo', query: { id: flowmeterId } })
    } else {
      this.$router.push({ path: '/flowmeterInfo' })
    }
  }
}
</script>
<style lang="less" scoped>
.label {
  margin-left: 12px;
  font-size: 14px;
  float: left;
}
</style>
