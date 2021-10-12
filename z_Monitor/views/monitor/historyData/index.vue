<template>
  <div style="height:100%;width:100%;padding:10px;box-sizing:border-box">
    <el-row style="height:120px">
      <flowmeterHeader style="width:100%;height:100%" />
    </el-row>
    <el-row style="height:calc(100% - 120px)">
      <el-col :span="18">
        <historyInfo :flowmeterId="flowmeterId" />
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="6">
        <dataCompare />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, getFlowmeterDetail } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import importantMeasure from '../flowmeterInfo/importantMeasure.vue'
import historyInfo from './historyInfo.vue'
import dataCompare from './dataCompare.vue'
import flowmeterHeader from '../../../components/flowmeterHeader.vue'

// *****************************************************************
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
}
</script>
<style scoped>
</style>
