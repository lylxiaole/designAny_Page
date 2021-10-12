<template>
  <div>
    <el-row style="height:50px">
      <span>时间范围:</span>
      <el-date-picker v-model="chooseDate" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-button>查询</el-button>
    </el-row>
    <el-row style="height:calc(100% - 50px)">
      <el-table :data="historyData" border>
        <el-table-column prop="date" label="数据采集点" width="180">
        </el-table-column>
        <el-table-column prop="name" label="实时数值" width="180">
        </el-table-column>
        <el-table-column prop="address" label="计量单位">
        </el-table-column>
        <el-table-column prop="address" label="数据采集时间">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="viewFlowmeterInfo(scope.row)" type="text" size="small">主要信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk  } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
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

  //
  mounted() {}
  // **************************************************************
  private chooseDate: string = ''
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

  private async viewFlowmeterInfo(data: any) {}
}
</script>
<style lang="less" scoped>
</style>
