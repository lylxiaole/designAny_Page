<template>
  <div>
    <el-card style="height:100%;width:100%" class="box-card maincontainer" :style="containerStyle">
      <el-row class="row">
        <el-col :span="24">
          数采点:{{cardInfo.BJDZ}}
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">数据值:{{cardInfo.PHDVALUE}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">数采时间:{{cardInfo.PHDTIME}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">报警信息:{{cardInfo.CWXXZW}}</el-col>
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

  get containerStyle(): any {
    if (this.cardInfo && this.cardInfo.PHDVALUE && parseInt(this.cardInfo.PHDVALUE) > 0) {
      return { background: '#fff2f2', border: '1px solid #e35050' }
    } else {
      return { background: '#c1f397', border: '1px solid #29db50' }
    }
  }

  @Emit('onDealAlarm')
  private onDealAlarm(): any {}
}
</script>
<style lang="less" scoped>
.row {
  margin: 12px 0px;
}
.maincontainer {
  box-sizing: border-box;
  font-size: 14px;

  /deep/ .el-card__body {
    padding: 10px !important;
  }
}
</style>
