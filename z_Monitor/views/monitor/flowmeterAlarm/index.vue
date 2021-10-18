<template>
  <div class="pageView" style="height:100%;width:100%;">
    <el-row style="height:50px" class="showblock">
      <flowmeterHeader :flowmeterDetail.sync="flowmeterDetail" :showBtns="['history','detail']" style="width:100%;height:100%" />
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <el-col :span="8" style="box-sizing:border-box;height:100%;">
        <el-row style="height:50%;padding:15px" class="showblock">
          <currentAlarm :flowmeterId="flowmeterId" @onDealAlarm="onDealAlarm" style="height:100%;width:100%" />
        </el-row>
        <el-row style="height:50%;padding:6px" class="showblock">
          <alarmTop7 :flowmeterId="flowmeterId" style="height:100%;width:100%" />
        </el-row>
      </el-col>
      <!-- ************************************************************************* -->
      <el-col :span="16" style=" height:100%;">
        <alarmHistory class="showblock" :flowmeterId="flowmeterId" @onDealAlarm="onDealAlarm" />
      </el-col>
    </el-row>
    <dealAlarm ref="alarmDialog" @onSure="dealSure" @onCancel="dealCancel" />
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
import dealAlarm from './dealAlarm.vue'
// *****************************************************************
/***流量计报警 */
@Component({
  components: {
    flowmeterHeader,
    currentAlarm,
    alarmTop7,
    alarmHistory,
    dealAlarm
  }
})
export default class Index extends PageBase {
  private flowmeterId: string = ''
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
  // ************************************************************
  private async refreshChildrenData() {}
  private async clearChildrenData() {}
  // ************************************************************
  private onDealAlarm(data: any) {
    ;(this.$refs.alarmDialog as dealAlarm).dealCurrentAlarm(data)
  }
  private async dealSure() {
    //TODO 刷新各个子组件的数据
  }
  private async dealCancel() {}
}
</script>
<style lang="less" scoped>
@import '../../../assets/monitorStyle.less';
</style>
