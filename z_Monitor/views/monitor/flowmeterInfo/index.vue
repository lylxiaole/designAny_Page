<template>
  <div class="pageView" style="height: 100%; width: 100%">
    <el-row style="height: 50px" class="showblock">
      <flowmeterHeader :flowmeterDetail.sync="flowmeterDetail" :showBtns="['history', 'alarm']" style="width: 100%; height: 100%" />
    </el-row>
    <!-- ************************************************* -->
    <el-row style="height: 200px">
      <el-col class="showblock" style="width: calc(100% - 788px); height: 100%">
        <importantMeasure ref="importantMeasure" />
      </el-col>
      <!-- ************************************************* -->
      <el-col class="showblock" desc="仪表状态" style="width:240px;height:100%">
        <img style="width:100%;height:100%" :src="flowmeterStateIcon" />
      </el-col>
      <!-- ************************************************* -->
      <el-col class="showblock" style="width: 480px; height: 100%; padding: 8px">
        <div v-if="!currentAlrams || currentAlrams.length < 1" style="height: 100%; width: 100%" class="verticalAlignCenter flexHorilanLayout">
          暂无当前报警数据
        </div>
        <el-carousel v-else :interval="4000" type="card" height="100%">
          <el-carousel-item v-for="item in currentAlrams" :key="item.BJID">
            <alarmCard style="height: 100%" :cardInfo="item" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <!-- ************************************************* -->
    <el-row style="height: calc(100% - 250px)">
      <!-- ************************************************* -->
      <el-col style="height: 100%; width: calc(50% - 16px)" class="showblock">
        <el-row desc="关键测量" style="height: 50%">
          <div style="height:32px" class="verticalAlignCenter tabletitle">
            <div></div>关键测量
          </div>
          <el-table header-row-class-name="monitorTable" stripe size="small" :data="keyMeasurementPoint" border height="calc(100% - 32px)"
            style="width: 100%">
            <el-table-column prop="point" label="数据采集点"> </el-table-column>
            <el-table-column prop="value" label="实时数值"> </el-table-column>
            <el-table-column prop="unit" label="计量单位"> </el-table-column>
            <el-table-column prop="time" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
        <!-- ************************************************* -->
        <el-row desc="仪表状态" style="height: 50%">
          <div style="height:32px" class="verticalAlignCenter tabletitle">
            <div></div>仪表状态
          </div>
          <el-table header-row-class-name="monitorTable" stripe :data="deviceStatus" border size="small" height="calc(100% - 60px)"
            style="width: 100%">
            <el-table-column prop="point" label="数据采集点"> </el-table-column>
            <el-table-column prop="value" label="实时数值"> </el-table-column>
            <el-table-column prop="unit" label="计量单位"> </el-table-column>
            <el-table-column prop="time" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
      <!-- ************************************************* -->
      <el-col style="height: 100%; width: calc(50% - 16px)" class="showblock">
        <div style="height:32px; " class="verticalAlignCenter tabletitle">
          <div></div>仪表系数
        </div>
        <el-table header-row-class-name="monitorTable" stripe size="small" :data="instrumentCoefficient" border height="calc(100% - 60px)"
          style="width: 100%">
          <el-table-column prop="point" label="数据采集点"> </el-table-column>
          <el-table-column prop="value" label="实时数值"> </el-table-column>
          <el-table-column prop="unit" label="计量单位"> </el-table-column>
          <el-table-column prop="time" label="数据采集时间"> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, getFlowmeterDetail, getCurrentAlarm } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'
import importantMeasure from './importantMeasure.vue'
import alarmCard from './alarmCard.vue'

var flowmeterNormalImg = require('../../../assets/flowmeterImg/flowmeterNormal.gif')
var flowmeterNotmalImg = require('../../../assets/flowmeterImg/flowmeterNotmal.gif')
// *****************************************************************
/***流量计信息 */
@Component({
  components: {
    flowmeterHeader,
    alarmCard,
    importantMeasure
  }
})
export default class Index extends PageBase {
  private timer: any = null
  private flowmeterId: string
  private flowmeterDetail: any = null
  @Watch('flowmeterDetail')
  private async watchFlowmeterDetailChange(data: any) {
    window.console.log('watchFlowmeterDetailChange:', data)
    this.flowmeterId = data.JLBID
    //清数据
    this.clearChildrenData()
    //查数据
    this.refreshChildrenData()
  }
  private get currentImportantMeasure(): importantMeasure {
    return this.$refs.importantMeasure as any
  }

  private flowmeterStateIcon: any = null

  mounted() {
    if (this.$route.query.id) {
      this.flowmeterId = this.$route.query.id as any
      this.initData()
    }
    this.timer = window.setInterval(this.refreshChildrenData, 10000)
  }
  private async initData() {
    let flowmeterDetails = await getFlowmeterDetail(this.flowmeterId)
    if (flowmeterDetails && flowmeterDetails.length > 0) {
      this.flowmeterDetail = flowmeterDetails[0]
    }
  }
  destroyed() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }
  // ***************关键测量表格*********************************************
  private keyMeasurementPoint: any[] = []
  // ***************仪表状态表格*********************************************
  private deviceStatus: any[] = []
  // ***************仪表系数表格*********************************************
  private instrumentCoefficient: any[] = []
  // ***************仪表报警卡片*********************************************
  private currentAlrams: any[] = []
  // *****************************************************************
  private async refreshChildrenData() {
    if (!this.flowmeterId) {
      return
    }
    var formData = new FormData()
    formData.append('action', 'getJlbTagInfoShow')
    formData.append('jlbid', this.flowmeterId)
    let res = await jkzl(formData)
    // window.console.log('refreshChildrenData:', res)
    //重要测量
    await this.currentImportantMeasure.addOneData(res.tagInfo)
    //关键点测量
    this.keyMeasurementPoint = this.cuteResToTable(res.keyTagInfo)
    //仪表状态表格
    this.deviceStatus = this.cuteResToTable(res.stateTagInfo)
    //仪表系数
    this.instrumentCoefficient = this.cuteResToTable(res.coefficientTagInfo)
    //TODO仪表状态图
    let directInfo = res.coefficientTagInfo.find((o) => o.tagCode.indexOf('DIRECT') > -1)
    if (directInfo.tagVal === '0') {
      this.flowmeterStateIcon = flowmeterNormalImg
    } else {
      this.flowmeterStateIcon = flowmeterNotmalImg
    }
    //TODO报警卡片
    let currentAlrams = await getCurrentAlarm(this.flowmeterId)
    window.console.log('currentAlrams:', currentAlrams)
    if (!currentAlrams) {
      currentAlrams = []
    } else {
      currentAlrams = currentAlrams
    }
    this.currentAlrams = currentAlrams
  }
  private async clearChildrenData() {
    this.currentImportantMeasure.clearData()
  }
  private cuteResToTable(data: any[]) {
    let res: any[] = []
    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      res.push({
        point: element.tagName,
        value: element.tagVal,
        unit: element.tagUnit,
        time: element.updateTime
      })
    }
    return res
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/monitorStyle.less';

.tabletitle {
  div {
    box-sizing: border-box;
    height: 70%;
    width: 10px;
    margin-left: 15px;
    border-left: 5px solid #1b4287;
  }
}
</style>
