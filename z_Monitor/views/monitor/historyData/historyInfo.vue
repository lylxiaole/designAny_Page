<template>
  <div style="height:100%;width:100%">
    <el-row style="height:50px">
      <span>时间范围:</span>
      <el-date-picker v-model="chooseDate" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <span>或前:</span>
      <el-input-number v-model="num" controls-position="right" :min="1"></el-input-number>
      <span>天</span>
    </el-row>
    <el-row style="height:calc(100% - 50px)"></el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************
/***贮运厂总览 */
@Component({
  components: {}
})
export default class historyInfo extends ComponentBase {
  // ********************************************************************************
  mounted() {}
  // *************** *********************************************
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
  private rangeDay: number = 0
}
</script>
<style scoped>
</style>
