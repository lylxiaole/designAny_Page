<template>
  <div class="pageView" style="height:100%;width:100%;padding:10px;box-sizing:border-box">
    <el-row style="height:60px" class="showblock">
      <flowmeterHeader :showBtns="['detail','alarm']" :flowmeterDetail.sync=" flowmeterDetail" style="width:100%;height:100%" />
    </el-row>
    <el-row style="height:calc(100% - 60px)" class="showblock">
      <el-col :span="18">
        <historyInfo ref="historyInfo" :flowmeterId="flowmeterId" @onSelectParams="onSelectParams" @onSelectChartData="onSelectChartData" />
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="6">
        <dataCompare ref="dataCompare" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, getFlowmeterDetail, getFlowmeterParams } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import importantMeasure from '../flowmeterInfo/importantMeasure.vue'
import historyInfo from './historyInfo.vue'
import dataCompare from './dataCompare.vue'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'

/***历史数据分析 */
@Component({
  components: {
    flowmeterHeader,
    importantMeasure,
    historyInfo,
    dataCompare
  }
})
export default class Index extends PageBase {
  private flowmeterId: string = null
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

  private currentParams: any[] = []
  // ********************************************************************************
  mounted() {
    if (this.$route.query.id) {
      this.flowmeterId = this.$route.query.id as any
      this.initData()
    }
  }
  private async initData() {
    let flowmeterDetails = await getFlowmeterDetail(this.flowmeterId)
    if (flowmeterDetails && flowmeterDetails.length > 0) {
      this.flowmeterDetail = flowmeterDetails[0]
    }
    let defaultParams = await this.getDefaultParams()
    await (this.$refs.historyInfo as historyInfo).setDefaultParams(defaultParams)
    await (this.$refs.dataCompare as dataCompare).setParams(defaultParams)

    await (this.$refs.historyInfo as historyInfo).refreshData()
  }
  private async getDefaultParams() {
    let res = await getFlowmeterParams(this.flowmeterId, null)
    if (!res) {
      res = []
    }
    return res.filter((element: any) => element.SFSSLL == '1' || element.SFSSLL == '2' || element.SFSSLL == '3' || element.SFSSLL == '5')
  }
  // *************** *********************************************
  private async refreshChildrenData() {
    var formData = new FormData()
    formData.append('action', 'getJlbTagInfoShow')
    formData.append('jlbid', this.flowmeterId)
    let res = await jkzl(formData)
    window.console.log('refreshChildrenData:', res)
  }
  private async clearChildrenData() {}

  private async onSelectParams(params: any[]) {
    ;(this.$refs.dataCompare as any).setParams(params)
  }
  private async onSelectChartData(data: any) {
    ;(this.$refs.dataCompare as any).setData(data)
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/monitorStyle.less';
</style>
