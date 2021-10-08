<template>
  <div>
    <el-card class="box-card">
      <el-row class="row">
        <el-col :span="12">位号:xxxxx</el-col>
        <el-col :span="12">状态:故障</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">温度:12℃</el-col>
        <el-col :span="12">密度:34g/m3</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">质量:67kg</el-col>
        <el-col :span="12">瞬间流量:46kg/m3</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">是否有报警:5条</el-col>
      </el-row>
      <el-row class="row">
        <el-button class="button" size="mini" @click="openFlowmeterInfo">单表信息</el-button>
        <el-button class="button" size="mini" @click="openAlarmInfo">报警信息</el-button>
        <el-button class="button" size="mini" @click="openFlowmeterHis">历史信息</el-button>
        <el-button class="button" size="mini" @click="openFlowmeterCompare">双表对比</el-button>
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
// *****************************************************************
/***作业区流量计 */
@Component({
  components: {}
})
export default class flowmeterCard extends ComponentBase {
  @Prop({
    default: () => {
      return { code: 'HT-4009', time: '08-18 12:00:00', desc: '维保到期xxxxxxxxxxxx', timeLength: '3小时' }
    }
  })
  cardInfo: any

  //
  mounted() {}
  // ************************************************************
  private async openFlowmeterInfo() {
    this.$router.push({ path: '/flowmeterInfo', query: { code: 'xxxx' } })
  }
  private async openAlarmInfo() {
    this.$router.push({ path: '/flowmeterAlarm', query: { code: 'xxxx' } })
  }
  private async openFlowmeterHis() {
    this.$router.push({ path: '/historyData', query: { code: 'xxxx' } })
  }
  private async openFlowmeterCompare() {
    //TODO 选择计量表参数
    this.$router.push({ path: '/flowmeterCompare', query: { code: 'xxxx' } })
  }
}
</script>
<style lang="less" scoped>
.row {
  margin: 12px 0px;
}
.button {
  padding: 7px 8px;
}

/deep/ .el-card > .el-card__body {
  padding: 10px !important;
}
</style>
