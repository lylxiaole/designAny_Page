<template>
  <div>
    <el-card style="height:90%;width:100%;padding-top:5%" class="box-card maincontainer   ">
      <el-row class="row">
        <el-col :span="16">
          <span>数采点:{{cardInfo.BJDZ}}</span>
        </el-col>
        <el-col :span="8">
          <el-button class="button" size="mini" @click="onDealAlarm">报警处理</el-button>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">数据值:{{cardInfo.PHDVALUE}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">可信度:{{cardInfo.CONFIDENCE}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">数采时间:{{cardInfo.PHDTIME}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">报警信息:{{cardInfo.CWXXZW}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">处理建议:{{cardInfo.CLJY}}</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import ComponentBase from '@src/views/ComponentBase'
import { jkzl, jlbjk } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
import * as echarts from 'echarts'

// *****************************************************************
/***作业区流量计 */
@Component({
  components: {}
})
export default class alarmCard extends ComponentBase {
  @Prop({
    default: () => {
      return {
        BJID: '', //报警ID
        BJDZ: '112', //数采点
        CONFIDENCE: '', //可信度
        PHDVALUE: '0', //数采值
        PHDTIME: '', //报警时间
        CWXXZW: ' ', //报警信息
        CLJY: ' ' //处理建议
      }
    }
  })
  cardInfo: any

  //
  mounted() {}

  @Emit('onDealAlarm')
  private onDealAlarm(): any {}
}
</script>
<style lang="less" scoped>
.row {
  margin: 12px 0px;
}
.maincontainer {
  background: #fff2f2;
  border: 1px solid #e35050;
  box-sizing: border-box;
  padding: 20px;
}
</style>
