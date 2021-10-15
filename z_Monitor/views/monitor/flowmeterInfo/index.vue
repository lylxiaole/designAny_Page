<template>
  <div class="pageView" style="height:100%;width:100%;">
    <el-row style="height:70px">
      <flowmeterHeader :flowmeterDetail.sync="flowmeterDetail" :showBtns="['history','alarm']" style="width:100%;height:100%" />
    </el-row>
    <el-row style=" height:calc(100% - 70px)">
      <el-col :span="12">
        <el-row style="height:33%;">
          <el-col :span="12" desc="重要测量" style="border:1px solid #000">
            <importantMeasure ref="importantMeasure" />
          </el-col>
          <el-col :span="12" desc="仪表状态" style="border:1px solid #000">
          </el-col>
        </el-row>
        <el-row desc="关键测量" style="height:33%;border:1px solid #000">
          <el-table :data="keyMeasurementPoint" border height="100%" style="width: 100%">
            <el-table-column prop="point" label="数据采集点">
            </el-table-column>
            <el-table-column prop="value" label="实时数值">
            </el-table-column>
            <el-table-column prop="unit" label="计量单位">
            </el-table-column>
            <el-table-column prop="time" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
        <el-row desc="仪表状态" style="height:34%;border:1px solid #000">
          <el-table :data="deviceStatus" border height="100%" style="width: 100%">
            <el-table-column prop="point" label="数据采集点">
            </el-table-column>
            <el-table-column prop="value" label="实时数值">
            </el-table-column>
            <el-table-column prop="unit" label="计量单位">
            </el-table-column>
            <el-table-column prop="time" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="12">
        <el-row desc="仪表报警" style="height:50%;border:1px solid #000">
          <div v-if="!currentAlrams||currentAlrams.length<1" style="height:100%;width:100%;" class="verticalAlignCenter flexHorilanLayout">
            暂无当前报警数据
          </div>
          <el-carousel v-else :interval="4000" type="card" height="100%">
            <el-carousel-item v-for="item in currentAlrams" :key="item.BJID">
              <alarmCard @onDealAlarm="onDealAlarm(item)" :cardInfo="item" />
            </el-carousel-item>
          </el-carousel>
        </el-row>
        <el-row desc="仪表系数" style="height:50%;border:1px solid #000">
          <el-table :data="instrumentCoefficient" border height="100%" style="width: 100%">
            <el-table-column prop="point" label="数据采集点">
            </el-table-column>
            <el-table-column prop="value" label="实时数值">
            </el-table-column>
            <el-table-column prop="unit" label="计量单位">
            </el-table-column>
            <el-table-column prop="time" label="数据采集时间">
            </el-table-column>
          </el-table>
        </el-row>
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
    // window.console.log('watchFlowmeterDetailChange:', data)
    this.flowmeterId = data.JLBID
    //清数据
    this.clearChildrenData()
    //查数据
    this.refreshChildrenData()
  }

  private get currentImportantMeasure(): importantMeasure {
    return this.$refs.importantMeasure as importantMeasure
  }

  mounted() {
    window.console.log('flowmeterInfo:', this.$route.query)
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
    var formData = new FormData()
    formData.append('action', 'getJlbTagInfoShow')
    formData.append('jlbid', this.flowmeterId)
    let res = await jkzl(formData)
    window.console.log('refreshChildrenData:', res)
    //重要测量
    await this.currentImportantMeasure.addOneData(res.tagInfo)
    //关键点测量
    this.keyMeasurementPoint = this.cuteResToTable(res.keyTagInfo)
    //仪表状态表格
    this.deviceStatus = this.cuteResToTable(res.stateTagInfo)
    //仪表系数
    this.instrumentCoefficient = this.cuteResToTable(res.coefficientTagInfo)
    //TODO仪表状态图

    //TODO报警卡片
    this.currentAlrams = res.warnTagInfo
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
</style>
