<template>
  <div>
    <el-row style="height:50px">
      <span>时间范围:</span>
      <el-date-picker v-model="chooseDates" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-button @click="loadData">查询</el-button>
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <el-table :data="historyData" border>
        <el-table-column prop="TAGMC" label="数据采名称" width="180">
        </el-table-column>
        <el-table-column prop="ZTMS" label="状态" width="180">
        </el-table-column>
        <el-table-column prop="CWXXZW" label="报警信息" width="180">
        </el-table-column>
        <el-table-column prop="PHDVALUE" label="实际数值" width="180">
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
// *****************************************************************
/***作业区流量计 */
@Component({
  components: {}
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
  private chooseDates: any[] = [new Date(), new Date()]
  private pickerOptions: any = {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  }

  // ************************************************************
  private historyData: any[] = []
  private async dealAlarm(data: any) {}
  private async loadData() {
    let startTime = null
    let endTime = null
    if (this.chooseDates && this.chooseDates.length > 0) {
      startTime = moment(this.chooseDates[0]).format('YYYY-MM-DD HH:MM:ss')
      endTime = moment(this.chooseDates[1]).format('YYYY-MM-DD HH:MM:ss')
    }
    let alarmHis = await getAlarmHistory(this.flowmeterId, startTime, endTime)
    this.historyData = alarmHis
    // window.console.log('getAlarmHistory:', alarmHis)
  }

  // ************************************************************

  @Emit('onDealAlarm')
  private onDealAlarm(alarmData: any): any {}
}
</script>
<style lang="less" scoped>
</style>
