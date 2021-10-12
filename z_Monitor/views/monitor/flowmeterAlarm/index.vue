<template>
  <div style="height:100%;width:100%;padding:10px;box-sizing:border-box">
    <el-row style="height:120px">
      <flowmeterHeader :flowmeterDetail.sync="flowmeterDetail" style="width:100%;height:100%" />
    </el-row>
    <el-row style=" height:calc(100% - 120px)">
      <el-col :span="8">
        <el-row style="height:50%">
          <currentAlarm :flowmeterId="flowmeterId" style="height:100%;width:100%" />
        </el-row>
        <el-row style="height:50%">
          <alarmTop7 :flowmeterId="flowmeterId" style="height:100%;width:100%" />
        </el-row>
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="16">
        <alarmHistory :flowmeterId="flowmeterId" />
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
import flowmeterHeader from '../../../components/flowmeterHeader.vue'
import currentAlarm from './currentAlarm.vue'
import alarmTop7 from './alarmTop7.vue'
import alarmHistory from './alarmHistory.vue'
// *****************************************************************
/***流量计报警 */
@Component({
  components: {
    flowmeterHeader,
    currentAlarm,
    alarmTop7,
    alarmHistory
  }
})
export default class Index extends PageBase {
  private flowmeterId: string = ''
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
    window.console.log('报警界面，计量表Id:', this.$route.query.id)
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
  // ************************************************************
  private async refreshChildrenData() {}
  private async clearChildrenData() {}
}
</script>
<style scoped>
</style>
