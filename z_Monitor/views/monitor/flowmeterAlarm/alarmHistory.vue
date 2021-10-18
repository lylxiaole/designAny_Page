<template>
  <div style="box-sizing:border-box;height:100%;width:100%;padding:8px 8px 18px 8px">
    <el-row style="height:50px;position:relative">
      <dateRangePicker style="width:550px;float:left" :startTime.sync="startTime" :endTime.sync="endTime" />
      <el-button style="float:left;margin-left:16px" @click="loadData">查询</el-button>
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <el-table :data="historyData" size="small" border height="100%">
        <el-table-column prop="TAGMC" label="数据采名称">
        </el-table-column>
        <el-table-column prop="ZTMS" label="状态">
        </el-table-column>
        <el-table-column prop="CWXXZW" label="报警信息">
        </el-table-column>
        <el-table-column prop="PHDVALUE" label="实际数值">
        </el-table-column>
        <el-table-column prop="CONFIDENCE" label="可信度">
        </el-table-column>
        <el-table-column prop="KSSJ" label="开始时间">
        </el-table-column>
        <el-table-column prop="JSSJ" label="结束时间">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="onDealAlarm(scope.row)" type="text" size="small">报警处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk, getAlarmHistory } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import moment from 'moment'
import dateRangePicker from '@src/components/TimePickr/dateRangePicker.vue'
// *****************************************************************
/***作业区流量计 */
@Component({
  components: {
    dateRangePicker
  }
})
export default class alarmHistory extends ComponentBase {
  @Prop({
    default: () => {
      return null
    }
  })
  private flowmeterId: string
  @Watch('flowmeterId')
  private async watchflowmeterIdChange(val: any) {
    if (val) {
      this.loadData()
    }
  }
  //
  mounted() {}
  // **************************************************************
  private startTime: any = new Date()
  private endTime: any = new Date()
  // ************************************************************
  private historyData: any[] = []
  private async dealAlarm(data: any) {}
  private async loadData() {
    let startTime = moment(this.startTime).format('YYYY-MM-DD HH:MM:ss')
    let endTime = moment(this.endTime).format('YYYY-MM-DD HH:MM:ss')
    window.console.log('getAlarmHistory1:', startTime, endTime)
    let alarmHis = await getAlarmHistory(this.flowmeterId, startTime, endTime)
    this.historyData = alarmHis
    window.console.log('getAlarmHistory2:', alarmHis)
  }
  // ************************************************************

  @Emit('onDealAlarm')
  private onDealAlarm(alarmData: any): any {}
}
</script>
<style lang="less" scoped>
</style>
